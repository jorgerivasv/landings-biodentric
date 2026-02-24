exports.handler = async function (event) {
  try {
    const data = JSON.parse(event.body);

    const response = await fetch(process.env.SEGUROS_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Error en n8n" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" })
    };
  }
};