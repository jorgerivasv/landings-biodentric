exports.handler = async function (event) {

  try {

    // Solo permitir POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido" })
      };
    }

    if (!process.env.SEGUROS_WEBHOOK) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Webhook no configurado" })
      };
    }

    const data = JSON.parse(event.body);

    // Llamada al webhook n8n
    const response = await fetch(process.env.SEGUROS_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // Esperar respuesta real de n8n (Respond to Webhook)
    let responseBody;

    try {
      responseBody = await response.json();
    } catch {
      responseBody = { message: "Respuesta sin JSON desde n8n" };
    }

    // Si n8n respondió error
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          error: responseBody
        })
      };
    }

    // Si todo OK
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: responseBody
      })
    };

  } catch (error) {

    console.error("Error en crearPaciente:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Error interno en Netlify Function"
      })
    };

  }
};