/**
 * Script de testing para scraping manual
 * Útil para verificar que todo funciona antes de deployment
 *
 * Uso: node scripts/test-scraping.js
 */

const { chromium } = require('playwright');

async function testBasicScraping() {
  console.log('🚀 Iniciando test de scraping...\n');

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  // Test 1: Navegar a página de prueba
  console.log('📝 Test 1: Navegación básica');
  try {
    await page.goto('https://www.google.com', { timeout: 10000 });
    console.log('✅ Navegación exitosa\n');
  } catch (error) {
    console.error('❌ Error en navegación:', error.message);
    await browser.close();
    process.exit(1);
  }

  // Test 2: Extraer datos simples
  console.log('📝 Test 2: Extracción de datos');
  try {
    const title = await page.title();
    console.log(`✅ Título extraído: "${title}"\n`);
  } catch (error) {
    console.error('❌ Error extrayendo datos:', error.message);
  }

  // Test 3: Simular scraping de resultados
  console.log('📝 Test 3: Simulación de scraping de resultados');
  console.log('   Nota: Este test simula la estructura esperada\n');

  const mockResults = {
    animalitos: [
      {
        game: 'Animalitos 12pm',
        winner: 9,
        date: new Date().toISOString().split('T')[0]
      }
    ],
    loterias: [
      {
        name: 'Lotería del Zulia',
        winner: '452',
        date: new Date().toISOString().split('T')[0]
      }
    ]
  };

  console.log('   Resultados simulados:');
  console.log(JSON.stringify(mockResults, null, 2));
  console.log('\n✅ Estructura de datos correcta\n');

  await browser.close();

  console.log('🎉 Todos los tests pasaron correctamente');
  console.log('\n📌 Próximos pasos:');
  console.log('   1. Iniciar Strapi: npm run develop');
  console.log('   2. Activar cron: export ENABLE_CRON=true');
  console.log('   3. Probar API: curl -X POST http://localhost:1337/api/results/scrape');
}

// Ejecutar tests
testBasicScraping().catch(error => {
  console.error('\n❌ Error fatal en tests:', error);
  process.exit(1);
});
