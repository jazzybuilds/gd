const forms = require('./forms.json');
const axios = require("axios")

exports.handler = async function (event) {
  const payload = JSON.parse(event.body)

  if (!payload.formId || !payload.sessionId || !payload.referenceId || !payload.type || !payload.status || !payload.amount) {
    return {
      statusCode: 422,
      body: "Invalid form payload"
    }
  }

  const form = forms.find(form => form.id === payload.formId)
  if (!form) {
    console.log("Cant form form with id", payload.formId)
    return {
      statusCode: 404,
      body: "Unrecognized form submitted"
    }
  }

  const finalAmountField = form.fields.find(field => field.itemName && field.itemName.toLowerCase() === 'finalamount')
  if (!finalAmountField) {
    console.log("cant find final amount field")
    return {
      statusCode: 422,
      body: "Unable to find relevant data"
    };
  }

  const formFieldsData = [{
    "Value": String(payload.amount),
    "Id": finalAmountField.itemID,
    "Name": finalAmountField.itemName
  }]

  const discountField = form.fields.find(field => field.itemName && field.itemName.toLowerCase() === 'discounts')
  if (discountField) {
    formFieldsData.push({
      "Value": payload.discountCode,
      "Id": discountField.itemID,
      "Name": discountField.itemName
    })
  }

  try {
    const response = await axios.post(`${process.env.SITECORE_ORIGIN}/api/forms/updateformdata`, {
      "FormId": payload.formId,
      "SitecoreFormSessionId": payload.sessionId,
      "Status": payload.status,
      "PaymentMethod": payload.type,
      "WebsiteReferenceID": payload.referenceId,
      "FormFields": formFieldsData
    }, {
      headers: {
        "Authorization": `Basic ${process.env.SITECORE_PROXY_BASIC_AUTH}`
      }
    })
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error(error)
    return {
      statusCode: 502,
      body: "Unable to update form"
    };
  }
};

