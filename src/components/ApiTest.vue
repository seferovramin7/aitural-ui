<template>
  <div class="api-test">
    <h3>API Test</h3>
    <button @click="testApi" :disabled="loading">Test API</button>
    <div v-if="loading">Testing API...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="result" class="result">
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ApiTest',
  data() {
    return {
      loading: false,
      error: null,
      result: null
    };
  },
  methods: {
    async testApi() {
      this.loading = true;
      this.error = null;
      this.result = null;
      
      // Create a custom axios instance without browser headers
      const customAxios = axios.create();
      
      // Remove problematic headers
      customAxios.interceptors.request.use(config => {
        // Set only the headers we need
        config.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        return config;
      });
      
      try {
        console.log('Testing API with direct request');
        
        // Test with direct URL to backend with minimal headers
        const directResponse = await customAxios.post('http://localhost:8080/api/cars/suggestion', {
          text: "32min manat pulum var, maashim cemi 1000 manatdi, ne mashin meslehet gorersen, toyota corola xoshlayanam, oturacaqlar deri olsun, oglum deyir arxa kamera da hemishe istemishem papamin mashininda olsun"
        });
        
        console.log('Direct API response:', directResponse.data);
        this.result = directResponse.data;
      } catch (directError) {
        console.error('Direct API error:', directError);
        
        try {
          console.log('Testing API with proxy');
          
          // Try with proxy URL
          const proxyResponse = await customAxios.post('/api/cars/suggestion', {
            text: "32min manat pulum var, maashim cemi 1000 manatdi, ne mashin meslehet gorersen, toyota corola xoshlayanam, oturacaqlar deri olsun, oglum deyir arxa kamera da hemishe istemishem papamin mashininda olsun"
          });
          
          console.log('Proxy API response:', proxyResponse.data);
          this.result = proxyResponse.data;
        } catch (proxyError) {
          console.error('Proxy API error:', proxyError);
          
          try {
            // Try with fetch API as a last resort
            console.log('Testing API with fetch');
            const fetchResponse = await fetch('http://localhost:8080/api/cars/suggestion', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                text: "32min manat pulum var, maashim cemi 1000 manatdi, ne mashin meslehet gorersen, toyota corola xoshlayanam, oturacaqlar deri olsun, oglum deyir arxa kamera da hemishe istemishem papamin mashininda olsun"
              }),
              mode: 'cors'
            });
            
            if (fetchResponse.ok) {
              const data = await fetchResponse.json();
              console.log('Fetch API response:', data);
              this.result = data;
            } else {
              throw new Error(`Fetch failed with status: ${fetchResponse.status}`);
            }
          } catch (fetchError) {
            console.error('Fetch API error:', fetchError);
            this.error = `Direct error: ${directError.message}, Proxy error: ${proxyError.message}, Fetch error: ${fetchError.message}`;
          }
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.api-test {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.api-test button {
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.api-test button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  margin-top: 10px;
  color: red;
}

.result {
  margin-top: 10px;
  max-height: 300px;
  overflow: auto;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}
</style> 