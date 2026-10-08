/**
 * VERCEL SERVERLESS FUNCTION - API PROXY PARA RETO 5S MEDIPIEL
 * 
 * Actúa como intermediario seguro y de alto rendimiento entre la aplicación web
 * y el Web App de Google Apps Script. 
 * 
 * Beneficios clave:
 * 1. Elimina problemas de CORS y bloqueos de redirección 302 en Safari iOS y redes corporativas.
 * 2. Proporciona caché inteligente (s-maxage) para que las consultas carguen en milisegundos.
 * 3. Permite sincronización tanto GET (descarga) como POST (guardado) desde cualquier móvil o PC.
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjG846ZHMSSyIbZ7cPfToyal89sZ4bpar-WfZm-EoypEkZ8_2BAyYD5wr8FVOYekYsvA/exec";

export default async function handler(req, res) {
  // Encabezados CORS universales
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. OBTENER PARTICIPANTES (GET)
  if (req.method === "GET") {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const targetUrl = `${SCRIPT_URL}?action=get_all&_t=${Date.now()}`;
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({
          status: "error",
          message: `Google Sheets respondió con código HTTP ${response.status}`
        });
      }

      const data = await response.json();

      // Caché edge de 10s para acelerar consultas repetidas
      res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=40");
      return res.status(200).json(data);
    } catch (err) {
      console.error("Error en API Proxy GET:", err);
      return res.status(502).json({
        status: "error",
        message: err.name === "AbortError" 
          ? "Tiempo de espera agotado al conectar con Google Sheets" 
          : (err.message || "Error al conectar con Google Sheets")
      });
    }
  }

  // 2. GUARDAR / SINCRONIZAR PARTICIPANTE (POST)
  if (req.method === "POST") {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      let payload = req.body;
      if (typeof payload !== "string") {
        payload = JSON.stringify(payload);
      }

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: payload,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const text = await response.text();
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(text);
      } catch (e) {
        jsonResponse = { status: "success", raw: text };
      }

      return res.status(200).json(jsonResponse);
    } catch (err) {
      console.error("Error en API Proxy POST:", err);
      return res.status(502).json({
        status: "error",
        message: err.message || "Error al sincronizar con Google Sheets"
      });
    }
  }

  return res.status(405).json({ message: "Método HTTP no permitido" });
}
