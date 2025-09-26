/**
 * Logika utama backend untuk Shopee AI Assistant.
 * Fungsi ini mencakup akses ke environment variables (GEMINI_API_KEY, SHOPEE_PARTNER_KEY)
 * yang diatur melalui GitHub Actions secrets.
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// --- Konfigurasi Global ---
// Mengatur jumlah maksimum instances untuk kontrol biaya
setGlobalOptions({ maxInstances: 10 });

// Pastikan environment variables tersedia.
// Nilai ini di-set melalui 'env' di file firebase-deploy.yml
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SHOPEE_PARTNER_KEY = process.env.SHOPEE_PARTNER_KEY;

// Logika ini akan berjalan saat Functions di-deploy. 
// Berguna untuk debugging apakah secrets sudah terload.
if (!GEMINI_API_KEY) {
    logger.error("Error: GEMINI_API_KEY is not set in environment variables!");
}
if (!SHOPEE_PARTNER_KEY) {
    logger.error("Error: SHOPEE_PARTNER_KEY is not set in environment variables!");
}


// --- 1. Fungsi Simulasi Refresh Token Shopee ---
// Fungsi HTTPS callable yang dapat dipanggil langsung dari frontend (index.html)
// Fungsi ini mensimulasikan proses otentikasi yang diperlukan frontend Anda.
exports.refreshAccessToken = onCall(async (request) => {
    logger.info("refreshAccessToken dipanggil.", { key: SHOPEE_PARTNER_KEY ? 'Loaded' : 'Missing' });

    if (!SHOPEE_PARTNER_KEY) {
        throw new Error("Shopee Partner Key is missing. Check your GitHub Secrets.");
    }
    
    // --- Lakukan Panggilan API Shopee di sini ---
    // (Simulasi data yang dibutuhkan frontend agar status koneksi berubah dari 'Loading...')
    
    return {
        status: "success",
        shopId: "simulasi_shop_123",
        partnerId: "simulasi_partner_456",
        accessToken: "simulasi_token_abc",
        message: "Token berhasil dimuat (Simulasi)"
    };
});


// --- 2. Fungsi Chat dengan Gemini ---
// Fungsi untuk memproses pesan dari user dan memanggil Gemini API
exports.chatAssistant = onCall(async (request) => {
    logger.info("chatAssistant dipanggil.", { apiKey: GEMINI_API_KEY ? 'Loaded' : 'Missing', data: request.data });

    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing. Cannot proceed with chat.");
    }
    
    // Asumsi: request.data berisi { message: "Tanya tentang stok..." }
    const userMessage = request.data.message || "Pesan Kosong";

    // --- Lakukan Panggilan Gemini API di sini ---
    // (Untuk menghemat biaya dan waktu, kita berikan respons simulasi)

    const simulatedGeminiResponse = `Tentu! Saya melihat stok produk '${userMessage.substring(0, 15)}...' masih tersedia.`;

    return {
        response: simulatedGeminiResponse
    };
});
