class PaymentsController < ApplicationController
  require 'httparty'

  def create
    payment = Payment.new(payment_params)

    if payment.save
      payment_method_id = params[:payment_method] || "pix" # Valor padrão: Pix

      body = configure_body(payment, payment_method_id)

      if body.nil?
        render json: { success: false, message: "Erro ao configurar pagamento." }, status: :unprocessable_entity
        return
      end

      Rails.logger.info("Dados enviados para o MercadoPago: #{body}")

      # Enviar requisição ao MercadoPago
      response = HTTParty.post(
        'https://api.mercadopago.com/v1/payments',
        headers: { 'Authorization' => "Bearer #{ENV['MERCADOPAGO_ACCESS_TOKEN']}" }, 
        body: body.to_json
      )


      # Tratar a resposta do MercadoPago
      response_data = handle_response(response)

      if response_data[:success]
        payment.update(status: 'approved')
        render json: {
          success: true,
          message: 'Payment successful',
          boleto_url: response_data[:boleto_link],
          pix_qr_code: response_data.dig(:pix_data, 'qr_code'),
          pix_qr_code_link: response_data.dig(:pix_data, 'qr_code_link'),
          transaction_id: response_data[:transaction_id],
          status: response_data[:status]
        }, status: :ok
      else
        payment.update(status: 'failed')
        render json: { success: false, message: 'Payment failed', errors: response_data[:error] }, status: :unprocessable_entity
      end
    else
      render json: { success: false, errors: payment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Função para configurar o corpo da requisição
  def configure_body(payment, payment_method_id)
    Rails.logger.info "Parâmetros recebidos no backend: #{params}"

    payer = {
      email: payment.email,
      first_name: payment.name.split.first,
      last_name: payment.name.split.drop(1).join(" ")
    }

    if payment_method_id == "credit_card"
      unless params[:card_number].present? && params[:card_number].length >= 6
        Rails.logger.error "Número do cartão inválido ou não fornecido."
        return nil
      end

      bin = params[:card_number][0..5]
      detected_payment_method = detect_payment_method(bin)

      if detected_payment_method.nil?
        Rails.logger.error "Não foi possível determinar o método de pagamento para o BIN: #{bin}."
        return nil
      end

      {
        transaction_amount: payment.amount.to_f,
        description: "Payment for #{payment.name}",
        payment_method_id: detected_payment_method,
        token: params[:card_token],
        installments: 1, # Pagamento à vista
        payer: {
          email: payment.email,
          first_name: payment.name.split.first,
          last_name: payment.name.split.drop(1).join(" "),
          identification: {
            type: params[:identification_type],
            number: params[:identification_number]
          }
        }
      }
    else
      # Configuração para Pix ou boleto
      if payment_method_id == "bolbradesco"
        payer[:identification] = {
          type: "CPF",
          number: params[:identification_number]
        }
      end

      {
        transaction_amount: payment.amount.to_f,
        description: "Payment for #{payment.name}",
        payment_method_id: payment_method_id,
        payer: payer
      }
    end
  end

  # Função para tratar a resposta do MercadoPago
  def handle_response(response)
    if response.code == 200 || response.code == 201
      Rails.logger.info "Pagamento processado com sucesso: #{response.body}"
      {
        success: true,
        transaction_id: response['id'],
        status: response['status'],
        boleto_link: response.dig('transaction_details', 'external_resource_url'),
        pix_data: response.dig('point_of_interaction', 'transaction_data')
      }
    else
      Rails.logger.error "Erro no pagamento: #{response.body}"
      {
        success: false,
        error: response['message'] || 'Erro desconhecido'
      }
    end
  end

  # Função para detectar o método de pagamento
  def detect_payment_method(bin)
    Rails.logger.info "BIN do cartão: #{bin}"

    case bin
    when '503143'
      'master'
    when '423564'
      'visa'
    else
      begin
        response = HTTParty.get(
          "https://api.mercadopago.com/v1/payment_methods/search?bin=#{bin}&site_id=MLB",
          headers: { 'Authorization' => "Bearer #{ENV['MERCADOPAGO_ACCESS_TOKEN']}" } 
        )
        payment_methods = JSON.parse(response.body)['results']


        if payment_methods.is_a?(Array) && payment_methods.any?
          payment_method_id = payment_methods.first['id']
          Rails.logger.info "Método de pagamento detectado: #{payment_method_id}"
          payment_method_id
        else
          Rails.logger.error "Nenhum método de pagamento encontrado para o BIN: #{bin}"
          nil
        end
      rescue StandardError => e
        Rails.logger.error "Erro ao detectar o método de pagamento: #{e.message}"
        nil
      end
    end
  end

  def payment_params
    params.require(:payment).permit(:name, :email, :amount)
  end
end