import React from "react"
import axios from "axios"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  PaymentRequestButtonElement
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useScript } from "../../../utils/hooks";
import { StyledButton } from "../Form.styles";
import { CardIcon, CardIconWrapper, Text } from "./Payment.styles";
import { maxInputWidth } from "../../../theme";
import { Modal } from "../../Modal";
import { formatPrice } from "./PaymentWrapper";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripeSecret = process.env.STRIPE_SECRET
const stripePromise = loadStripe(stripeKey);

// const stripeInstance = require("stripe")(stripeSecret);
// stripeInstance.applePayDomains.create({
//   domain_name: 'gd-dev.guidedogs.org.uk'
// });

interface UpdateReferenceProps {
  formId: string
  sessionId: string
  referenceNumber: string
  PaymentMethod: 'CC' | 'PP'
  status: string
  amount: number
  discountCode?: string
}

interface PaymentOptionProps extends Omit<UpdateReferenceProps, "PaymentMethod" | "status"> {
  paymentRequest: any
  statement: string
  productType: string
  summary: string
  onSubmit: (id: string) => void
  onReferenceUpdate: (ref: string) => void
}

interface makeStripePaymentResponse {
  reference: string
  message?: string
  intent?: any
}

interface makeStripePaymentProps extends Omit<UpdateReferenceProps, "PaymentMethod" | "status"> {
  stripe: any
  productType: string
  paymentMethod: any
  statement: string
}

const formatSummaryText = (amount, text) => `${text.replace("{amount}", `£${formatPrice(amount)}`)}`

const updateFormSubmission = async (props: UpdateReferenceProps) => {
  try {
    const { data } = await axios.post("/api-fe/formUpdate", {
      ...props,
      amount: props.amount / 100
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const makeStripePayment = async ({ stripe, paymentMethod, ...rest }: makeStripePaymentProps): Promise<makeStripePaymentResponse> => {
  let response
  console.log('makeStripePayment rest', rest)
  try {
    response = await axios.post("/api-fe/stripe", { ...rest })
    console.log('makeStripePayment respomse', response)
    if (!response.data) {
      return Promise.reject({
        message: "Something went wrong, please try again",
        reference: rest.referenceNumber,
      })
    }
  } catch (error) {
    console.error({ error })
    const newReference = await updateFormSubmission({
      formId: rest.formId,
      sessionId: rest.sessionId,
      referenceNumber: rest.referenceNumber,
      amount: rest.amount,
      discountCode: rest.discountCode,
      PaymentMethod: "CC",
      status: error.code
    })
    return Promise.reject({
      message: "Something went wrong, please try again",
      reference: newReference.WebsiteReferenceID
    })
  }

  const payload = await stripe.confirmCardPayment(response.data, {
    payment_method: paymentMethod,
    return_url: window.location.href
  }, { handleActions: false });


  console.log('makeStripePayment payload', payload)

  if (payload.error) {
    const newReference = await updateFormSubmission({
      formId: rest.formId,
      sessionId: rest.sessionId,
      referenceNumber: rest.referenceNumber,
      amount: rest.amount,
      discountCode: rest.discountCode,
      PaymentMethod: "CC",
      status: payload.error.code
    })
    return Promise.reject({
      message: payload.error.message ?? "Unable to take payment",
      reference: newReference.WebsiteReferenceID ?? rest.referenceNumber,
    })
  } else {
    const newReference = await updateFormSubmission({
      formId: rest.formId,
      sessionId: rest.sessionId,
      referenceNumber: rest.referenceNumber,
      amount: rest.amount,
      discountCode: rest.discountCode,
      PaymentMethod: "CC",
      status: "200"
    })
    return Promise.resolve({
      reference: newReference.WebsiteReferenceID,
      intent: payload.paymentIntent,
    })
  }
}

function getGooglePayRequest(amount: number): google.payments.api.PaymentDataRequest {
  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "MASTERCARD", "VISA"],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "stripe",
            "stripe:version": "2020-03-02",
            "stripe:publishableKey": stripeKey
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: process.env.NEXT_PUBLIC_STRIPE_MERCHANT_ID,
      merchantName: 'Guide Dogs',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: `${amount / 100}`,
      currencyCode: 'GBP',
      countryCode: 'GB',
    },
  };
}

const PaymentSummary = (props: { amount: number, summary: string }) => {
  return (
    <div>
      <Text>Payment summary:</Text>
      <p tabIndex={0}>{formatSummaryText(props.amount / 100, props.summary)}</p>
    </div>
  )
}

type StripeComponentProps = PaymentOptionProps & {
  error: string | null, submitting: boolean
  onSubmit: (paymentMethod: any) => Promise<void> //WHAT ABOUT THE PAYPAL ?
}

const Card = (props: StripeComponentProps) => {
  const elements = useElements();

  console.log('Card props', props)

  const options = {
    style: {
      base: {
        fontSize: '16px',
        color: "#424770",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#9e2146"
      }
    }
  }

  return (
    <React.Fragment>
      <Text>We accept these cards: </Text>
      <CardIconWrapper>
        <CardIcon src="/images/Card-VisaColour.svg" alt="visa" />
        <CardIcon src="/images/Card-MastercardColour.svg" alt="mastercard" />
        <CardIcon src="/images/Card-MaestroColour.svg" alt="maestro" />
        <CardIcon src="/images/Card-AmericanExpressColour.svg" alt="american express" />
      </CardIconWrapper>
      <PaymentSummary amount={props.amount} summary={props.summary} />
      {props.error && <span className="field-validation-error">{props.error}</span>}
      <label>
        Card numbers
        <div style={{ maxWidth: maxInputWidth }}>
          <CardNumberElement options={options} />
        </div>
      </label>
      <label>
        Expiration date
        <div style={{ width: 200 }}>
          <CardExpiryElement options={options} />
        </div>

      </label>
      <label>
        CVC
        <div style={{ width: 200 }}>
          <CardCvcElement options={options} />
        </div>
      </label>

      <StyledButton
        type="button"
        disabled={props.submitting}
        onClick={() => props.onSubmit({
          card: elements.getElement(CardNumberElement)
        })}
      >
        Submit payment
      </StyledButton>
    </React.Fragment>
  )
}

const ApplePay = (props: StripeComponentProps) => {
  if (props.submitting) {
    return <p>Processing payment...</p>
  }

  console.log('props.paymentRequest inside ApplePay component ApplePay', props.paymentRequest)
  return (
    <React.Fragment>
      <PaymentSummary amount={props.amount} summary={props.summary} />
      {props.paymentRequest && <PaymentRequestButtonElement options={{ paymentRequest: props.paymentRequest }} />}
      {props.error && <span className="field-validation-error">{props.error}</span>}
    </React.Fragment>
  )
}

const GooglePay = (props: StripeComponentProps & { googleClient: google.payments.api.PaymentsClient }) => {
  const [error, setError] = React.useState(null)
  const processPayment = () => {
    props.googleClient
      .loadPaymentData(getGooglePayRequest(props.amount))
      .then((paymentData) => {
        const tokenData = JSON.parse(paymentData.paymentMethodData.tokenizationData.token)
        props.onSubmit({
          card: {
            token: tokenData.id
          }
        })
      })
      .catch(function (err) {
        setError("Unable to take payment, please try again")
      });
  }

  const googlePayButton = props.googleClient.createButton({
    buttonColor: "default",
    buttonType: "short",
    onClick: processPayment
  });

  return (
    <React.Fragment>
      {props.submitting
        ? <p>Processing payment...</p>
        : <React.Fragment>
          <PaymentSummary amount={props.amount} summary={props.summary} />
          <div
            onClick={processPayment}
            dangerouslySetInnerHTML={{ __html: googlePayButton ? googlePayButton.innerHTML : "" }}
          />
        </React.Fragment>
      }
      {props.error || error && <span className="field-validation-error">{props.error ?? error}</span>}
    </React.Fragment>
  )
}

const PayPal = (props: PaymentOptionProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  console.log('PayPal props', props)

  const onApprove = async (actions) => {
    await actions.order.capture()
    return props.onSubmit(props.referenceNumber);
  }

  const createOrder = React.useCallback((data, actions) => {
    const context: any = { shipping_preference: "NO_SHIPPING" }
    return actions.order
      .create({
        application_context: context,
        purchase_units: [
          {
            description: props.referenceNumber,
            custom_id: props.productType,
            amount: {
              value: String(props.amount / 100),
            },
          },
        ],
      })
      .then((orderID) => orderID);
  }, [props.amount, props.referenceNumber]);

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_KEY,
        currency: "GBP",
      }}
    >
      {error && <span className="field-validation-error">{error}</span>}
      <Text>We accept these cards: </Text>
      <CardIconWrapper>
        <CardIcon src="/images/Card-VisaColour.svg" alt="visa" />
        <CardIcon src="/images/Card-MastercardColour.svg" alt="mastercard" />
        <CardIcon src="/images/Card-MaestroColour.svg" alt="maestro" />
        <CardIcon src="/images/Card-AmericanExpressColour.svg" alt="american express" />
      </CardIconWrapper>
      <PaymentSummary amount={props.amount} summary={props.summary} />

      <div style={{ maxWidth: "240px" }}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          disabled={isSubmitting}
          fundingSource="paypal"
          createOrder={createOrder}
          forceReRender={createOrder}
          onClick={() => {
            setError(null)
            setIsSubmitting(false)
          }}
          onApprove={(data, actions) => {
            console.log('onApprove ||||||||||', 'actions', actions, 'data', data)
            setIsSubmitting(true)
            return onApprove(actions)
          }}
          onError={async (error) => {
            setError("Unable to take payment")
            setIsSubmitting(false)
            try {
              const updatedResponse = await updateFormSubmission({
                formId: props.formId,
                sessionId: props.sessionId,
                referenceNumber: props.referenceNumber,
                amount: props.amount,
                discountCode: props.discountCode,
                PaymentMethod: "PP",
                status: "paypal_error"
              })
              props.onReferenceUpdate(updatedResponse.WebsiteReferenceID)
            } catch (error) {
              setError(error)
            }
          }}
        />
      </div>

    </PayPalScriptProvider>
  )
}

type PaymentMethod = "card" | "apple-pay" | "googlepay" | "paypal"

type StripePaymentsProps = PaymentOptionProps & {
  googlePayClient: google.payments.api.PaymentsClient | null,
  paymentMethod: PaymentMethod
}

const StripePayments = (props: StripePaymentsProps) => {
  const { paymentMethod, googlePayClient, ...paymentOptions } = props
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [iframe, setIframe] = React.useState<string | null>(null)
  const [stripeClientId, setStripeClientId] = React.useState<string | null>(null)
  const stripe = useStripe();





  console.log('paymentMethod________', paymentMethod,)
  console.log('paymentOptions ||||||', paymentOptions,)
  console.log('props.paymentRequest', props.paymentRequest)
  console.log('PROPS', props)







  React.useEffect(() => {
    const formSubmissionPayload: UpdateReferenceProps = {
      formId: props.formId,
      sessionId: props.sessionId,
      referenceNumber: props.referenceNumber,
      amount: props.amount,
      discountCode: props.discountCode,
      PaymentMethod: "CC", // WHY HARDCODED?
      status: "",
    }
    async function on3DSComplete() {
      setIframe(null)
      setError(null)
      if (stripeClientId) {
        try {
          const result = await stripe.retrievePaymentIntent(stripeClientId)
          if (result.paymentIntent.status === "succeeded") {
            props.onSubmit(props.referenceNumber)
          } else if (result.paymentIntent.status === "requires_payment_method") {
            const updatedResponse = await updateFormSubmission({
              ...formSubmissionPayload,
              status: result.paymentIntent.status
            })
            props.onReferenceUpdate(updatedResponse.WebsiteReferenceID)
            setError("Unable to authenticate payment")
            setSubmitting(false)
          }
        } catch (error) {
          console.error(error)
          const updatedResponse = await updateFormSubmission({
            ...formSubmissionPayload,
            status: "invalid_request_error"
          })
          props.onReferenceUpdate(updatedResponse.WebsiteReferenceID)
          setError("Something went wrong")
          setSubmitting(false)
        }
      }
    }

    window.addEventListener("message", function (ev) {
      if (ev.data === "3DS-authentication-complete") {
        on3DSComplete();
        document.body.style.overflow = "auto";
      }
    }, false);

  }, [stripeClientId])

  React.useEffect(() => {
    const handlePaymentMethodReceived = async (event) => {
      console.log('handlePaymentMethodReceived is called ||||||||||')
      console.log('handlePaymentMethodReceived with event', event)

      setSubmitting(true)

      try {
        const response = await makeStripePayment({
          stripe,
          formId: props.formId,
          amount: props.amount,
          statement: props.statement,
          discountCode: props.discountCode,
          sessionId: props.sessionId,
          productType: props.productType,
          referenceNumber: props.referenceNumber,
          paymentMethod: event.paymentMethod.id
        })
        console.log('handlePaymentMethodReceived response', response)
        event.complete("success")
        setError(null)
        props.onSubmit(response.reference)
      } catch (error) {
        event.complete("fail")
        props.onReferenceUpdate(error.reference)
        setError(error.message)
        setSubmitting(false)
      }
    }
    props.paymentRequest && props.paymentRequest.on("paymentmethod", handlePaymentMethodReceived);
  }, [])

  const handleSubmit = async (paymentMethod) => {
    setSubmitting(true)
    try {
      const response = await makeStripePayment({
        stripe,
        formId: props.formId,
        amount: props.amount,
        statement: props.statement,
        productType: props.productType,
        sessionId: props.sessionId,
        discountCode: props.discountCode,
        referenceNumber: props.referenceNumber,
        paymentMethod: paymentMethod
      })
      console.log('handleSubmit response', response)
      setError(null)
      setStripeClientId(response.intent.client_secret)
      if (response.intent.next_action) {
        setIframe(response.intent.next_action.redirect_to_url.url)
      } else {
        props.onSubmit(response.reference)
      }
    } catch (error) {
      setError(error.message)
      props.onReferenceUpdate(error.reference)
      setSubmitting(false)
    }
  }

  if (iframe) {
    return <Modal open={true}><iframe src={iframe} width="600" height="600" /></Modal>
  }

  const componentProps = {
    ...paymentOptions,
    onSubmit: handleSubmit,
    error: error,
    submitting: submitting
  }

  return (
    <React.Fragment>
      {{
        "card": <div className="Stripe"><Card {...componentProps} /></div>,
        "googlepay": <GooglePay {...componentProps} googleClient={googlePayClient} />,
        "apple-pay": <ApplePay {...componentProps} />,
      }[props.paymentMethod]}
    </React.Fragment>
  )
}

export type PaymentProps = Omit<PaymentOptionProps, "paymentRequest" | "summary"> & {
  paymentOptions: Array<{
    type: PaymentMethod
    summary: string
  }>
}

const PaymentOptions = (props: PaymentProps) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod | null>(null)
  const [applePayAvailable, setApplePayAvailable] = React.useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = React.useState<google.payments.api.PaymentsClient | null>(null);

  const componentProps = {
    paymentRequest: paymentRequest,
    formId: props.formId,
    amount: props.amount,
    productType: props.productType,
    statement: props.statement,
    sessionId: props.sessionId,
    discountCode: props.discountCode,
    referenceNumber: props.referenceNumber,
    onSubmit: props.onSubmit,
    onReferenceUpdate: props.onReferenceUpdate
  }
  console.log('stripe initial', stripe)
  console.log('paymentRequest outside  - setting apple pay availability',  paymentRequest)


  // @NOTE sets apple pay availability
  React.useEffect(() => {
    console.log('stripe in cycle', stripe)
    if (stripe) {
      let pr = null


      try {
         pr = stripe.paymentRequest({
          country: "GB",
          currency: "gbp",
          total: {
            label: "total",
            amount: props.amount,
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });  
  

      } catch (error) {
        
        console.error('paymentRequest error|||||', error)


      }

      if (pr) {
        console.log('paymentRequest inside  - setting apple pay availability',  paymentRequest)
        pr.canMakePayment().then((result) => {
          console.log('canMakePayment', result)
          try {
            setApplePayAvailable(result.applePay)
            setPaymentRequest(pr);
          } catch (error) {
            console.error('inner promise', error)
          }
          // if (result) {
          // }
        }).catch(error => console.error('faild promsie', error));
  
      }


      
    }
  }, [stripe]);

  // @NOTE sets google pay availability
  React.useEffect(() => {
    if (window.PaymentRequest) {
      const googleClient = new google.payments.api.PaymentsClient({
        environment: stripeKey.includes("live") ? "PRODUCTION" : "TEST"
      })

      googleClient
        .isReadyToPay(getGooglePayRequest(props.amount))
        .then(res => {
          if (res.result) {
            setGooglePayAvailable(googleClient)
          }
        })
        .catch(function (err) {
          console.error("Error determining readiness to use Google Pay: ", err);
        });
    }

  }, [])

  const cardOption = props.paymentOptions.find(option => option.type === "card")
  const appleOption = props.paymentOptions.find(option => option.type === "apple-pay")
  const googleOption = props.paymentOptions.find(option => option.type === "googlepay")
  const paypalOption = props.paymentOptions.find(option => option.type === "paypal")

  let summaryText = ""
  switch (paymentMethod) {
    case "card":
      summaryText = cardOption.summary
      break;
    case "apple-pay":
      summaryText = appleOption.summary
      break;
    case "googlepay":
      summaryText = googleOption.summary
      break;
    case "paypal":
      summaryText = paypalOption.summary
      break;
  }

  console.log('PaymentOptions £3£££££££££££££££££££££££££££££', componentProps)
  console.log('appleOption && applePayAvailable &&', appleOption && applePayAvailable )
  console.log('applePayAvailable',  applePayAvailable )
  console.log('appleOption ', appleOption)

  return (
    <React.Fragment>
      <div className="payment-types__options">
        <fieldset>
          <legend className="legend">Select payment method:</legend>

          {cardOption &&
            <div>
              <button className="payment-types__option payment-types__option--card" data-a11y-toggle="credit" id="a11y-toggle-0" aria-controls="credit" aria-expanded={paymentMethod === "card" ? "true" : "false"} onClick={() => setPaymentMethod("card")}>Credit or debit card</button>
            </div>
          }
          {appleOption && applePayAvailable &&
            <div>
              <button className="payment-types__option payment-types__option--apple-pay" data-a11y-toggle="apple-pay" id="a11y-toggle-1" aria-controls="apple-pay" aria-expanded={paymentMethod === "apple-pay" ? "true" : "false"} onClick={() => setPaymentMethod("apple-pay")}>Apple Pay</button>
            </div>
          }
          {googleOption && googlePayAvailable &&
            <div>
              <button className="payment-types__option payment-types__option--googlepay" data-a11y-toggle="googlepay" id="a11y-toggle-3" aria-controls="googlepay" aria-expanded={paymentMethod === "googlepay" ? "true" : "false"} onClick={() => setPaymentMethod("googlepay")}>Google Pay</button>
            </div>
          }
          {paypalOption &&
            <div>
              <button className="payment-types__option payment-types__option--paypal" data-a11y-toggle="paypal" id="a11y-toggle-2" aria-controls="paypal" aria-expanded={paymentMethod === "paypal" ? "true" : "false"} onClick={() => setPaymentMethod("paypal")}>PayPal</button>
            </div>
          }
        </fieldset>
      </div>

      {paymentMethod === "paypal" ?
        <PayPal {...componentProps} summary={summaryText} />
        : <StripePayments {...componentProps} summary={summaryText} googlePayClient={googlePayAvailable} paymentMethod={paymentMethod} />
      }
    </React.Fragment>
  )
}


const Payment = (props: PaymentProps) => {
  let googleAPI = "loading"
  if (props.paymentOptions.find(option => option.type === "googlepay") && window.PaymentRequest) {
    googleAPI = useScript(
      "https://pay.google.com/gp/p/js/pay.js"
    );
  } else {
    googleAPI = "ready"
  }

  return (
    <React.Fragment>
      {googleAPI === "ready" &&
        <Elements stripe={stripePromise}>
          <PaymentOptions {...props} amount={props.amount} />
        </Elements>
      }
    </React.Fragment>
  )
}

export default Payment