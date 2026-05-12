// test-api.js

async function testApi() {
  const API_URL = 'http://localhost:3001/api';

  try {
    console.log('1. Health check...');
    const health = await fetch(`${API_URL}/health`);
    console.log(await health.json());

    console.log('\n2. Generate FIBONACCI problem (L3)...');
    const genRes = await fetch(`${API_URL}/problems/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'FIBONACCI', level: 3 })
    });
    const problem = await genRes.json();
    console.log('Generated problem id:', problem.id);
    console.log('Generated problem description:', problem.description);

    console.log('\n3. Submit wrong answer...');
    const wrongRes = await fetch(`${API_URL}/problems/${problem.id}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: '1.5' })
    });
    console.log(await wrongRes.json());
    
    console.log('\n Тестування завершено! API відповідає.');
  } catch (err) {
    console.error('Error:', err);
    console.log('\n Переконайся, що сервер запущений і база даних підключена.');
  }
}

testApi();
