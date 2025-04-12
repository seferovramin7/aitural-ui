<template>
  <div class="app">
    <header class="header">
      <div class="container header-container">
        <h1>AiTural</h1>
      </div>
    </header>
    
    <main class="main">
      <div class="container">
        <div class="chat-container">
          <div class="chat-messages" ref="chatMessages">
            <div v-if="messages.length === 0" class="empty-state">
              <div class="empty-icon">🚗</div>
              <h2>Gəlin ehtiyyac və istəklərinizə ən uyğun avtomobili tapaq</h2>
              <p class="empty-description">İstədiyiniz maşın haqqında təsəvvürünüzü yazın və biz sizə ən yaxşı variantları təklif edək.</p>
            </div>
            
            <div v-for="(message, index) in messages" :key="index" 
                 :class="['message', message.type === 'user' ? 'user-message' : 'bot-message']">
              <div class="message-avatar">
                <div :class="['avatar', message.type === 'user' ? 'user-avatar' : 'bot-avatar']">
                  {{ message.type === 'user' ? '👤' : '🤖' }}
                </div>
              </div>
              <div class="message-content">
                <div v-if="message.type === 'user'" class="message-text">{{ message.text }}</div>
                <div v-else-if="message.type === 'bot' && message.cars && message.cars.length > 0">
                  <car-carousel :cars="message.cars" />
                </div>
                <div v-else-if="message.type === 'bot' && message.text" class="message-text">{{ message.text }}</div>
                <div v-else-if="message.type === 'loading'" class="loading-indicator">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-input-container">
            <div class="chat-input">
              <form @submit.prevent="sendMessage">
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="userInput" 
                    placeholder="İstədiyiniz maşın barədə yazın"
                    :disabled="loading"
                  />
                  <button type="submit" class="send-button" :disabled="loading || !userInput.trim()">
                    <span v-if="!loading" class="send-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="rotate(90 12 12)"/>
                      </svg>
                    </span>
                    <span v-else class="loading-dots">...</span>
                  </button>
                </div>
              </form>
            </div>
            <div class="input-footer">
              <p>AiTural helps you find the perfect car based on your requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import CarCarousel from './components/CarCarousel.vue';
import ApiTest from './components/ApiTest.vue';

export default {
  name: 'App',
  components: {
    CarCarousel,
    ApiTest
  },
  data() {
    return {
      userInput: '',
      messages: [],
      loading: false
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.loading) return;
      
      // Add user message
      this.messages.push({
        type: 'user',
        text: this.userInput
      });
      
      // Add loading message
      this.messages.push({
        type: 'loading'
      });
      
      const userQuery = this.userInput;
      this.userInput = '';
      this.loading = true;
      
      // Create a custom axios instance without browser headers
      const customAxios = axios.create();
      
      // Remove problematic headers
      customAxios.interceptors.request.use(config => {
        // Set only the headers we need
        config.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Chat-Id': '8dace3c3-4973-43c8-991e-23682d5341323682s53413 3' // Use exact same ID as successful curl
        };
        return config;
      });
      
      try {
        // Scroll to bottom
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        
        console.log('Sending request to backend:', userQuery);
        
        // Check if we're running on GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
          // In GitHub Pages environment, use mock data for demo
          console.log('Running on GitHub Pages, using demo data');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Remove loading message
          this.messages.pop();
          
          // Add bot response with sample cars
          this.messages.push({
            type: 'bot',
            cars: [
              {
                make: 'Toyota',
                model: 'Camry',
                year: 2022,
                price: 25000,
                imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
                features: ['Fuel efficient', 'Reliable', 'Comfortable']
              },
              {
                make: 'Honda',
                model: 'Accord',
                year: 2021,
                price: 24000,
                imageUrl: 'https://images.unsplash.com/photo-1522037576655-7a93ce0f4d10?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
                features: ['Safety features', 'Sporty design', 'Hybrid option']
              },
              {
                make: 'Tesla',
                model: 'Model 3',
                year: 2023,
                price: 45000,
                imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
                features: ['Electric', 'Autopilot', 'Long range']
              }
            ]
          });
          return;
        }
        
        // If not on GitHub Pages, proceed with real API calls
        // Try with proxy URL first
        try {
          const response = await customAxios.post('/api/cars/suggestion', {
            text: userQuery
          });
          
          console.log('Received response from backend:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: JSON.stringify(response.data, null, 2),
            timestamp: new Date().toISOString()
          });
          
          // Remove loading message
          this.messages.pop();
          
          // Add bot response with cars
          this.messages.push({
            type: 'bot',
            cars: response.data
          });
        } catch (proxyError) {
          console.error('Proxy API error:', proxyError);
          if (proxyError.response) {
            console.error('Response data:', proxyError.response.data);
            console.error('Response status:', proxyError.response.status);
            console.error('Response headers:', proxyError.response.headers);
          } else if (proxyError.request) {
            console.error('No response received:', proxyError.request);
          } else {
            console.error('Error setting up request:', proxyError.message);
          }
          
          try {
            // Try with direct URL as fallback
            const directResponse = await customAxios.post('http://52.90.3.212:8080/api/cars/suggestion', {
              text: userQuery
            });
            
            console.log('Direct API response:', {
              status: directResponse.status,
              statusText: directResponse.statusText,
              headers: directResponse.headers,
              data: JSON.stringify(directResponse.data, null, 2),
              timestamp: new Date().toISOString()
            });
            
            // Remove loading message
            this.messages.pop();
            
            // Add bot response with cars
            this.messages.push({
              type: 'bot',
              cars: directResponse.data
            });
          } catch (directError) {
            console.error('Direct API error:', directError);
            if (directError.response) {
              console.error('Response data:', directError.response.data);
              console.error('Response status:', directError.response.status);
              console.error('Response headers:', directError.response.headers);
            } else if (directError.request) {
              console.error('No response received:', directError.request);
            } else {
              console.error('Error setting up request:', directError.message);
            }
            
            // Try with native fetch as a last resort
            try {
              console.log('Attempting with native fetch API');
              const fetchResponse = await fetch('http://52.90.3.212:8080/api/cars/suggestion', {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Chat-Id': '8dace3c3-4973-43c8-991e-23682d5341323682s53413 3'
                },
                body: JSON.stringify({
                  text: userQuery
                })
              });
              
              if (!fetchResponse.ok) {
                throw new Error(`Fetch failed with status: ${fetchResponse.status}`);
              }
              
              const fetchData = await fetchResponse.json();
              console.log('Fetch API response:', {
                status: fetchResponse.status,
                statusText: fetchResponse.statusText,
                data: JSON.stringify(fetchData, null, 2),
                timestamp: new Date().toISOString()
              });
              
              // Remove loading message
              this.messages.pop();
              
              // Add bot response with cars
              this.messages.push({
                type: 'bot',
                cars: fetchData
              });
            } catch (fetchError) {
              console.error('Fetch API error:', fetchError);
              throw fetchError; // Rethrow to be caught by the outer catch
            }
          }
        }
      } catch (error) {
        console.error('Error fetching car suggestions:', error);
        
        // Remove loading message
        this.messages.pop();
        
        // Add error message
        this.messages.push({
          type: 'bot',
          text: 'Sorry, I encountered an error while searching for cars. Please try again. Error: ' + error.message
        });
      } finally {
        this.loading = false;
        
        // Scroll to bottom
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    generateChatId() {
      // Generate a random chat ID similar to the one used in curl
      const randomPart = Math.random().toString(36).substring(2, 15);
      return `8dace3c3-4973-43c8-991e-${randomPart}`;
    },
    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    }
  }
};
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: var(--secondary-color);
  color: #fff;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  letter-spacing: -0.5px;
}

.main {
  flex: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-container {
  width: 100%;
  height: calc(100vh - 65px);
  display: flex;
  flex-direction: column;
  background-color: var(--chat-bg);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.message {
  margin-bottom: 1.5rem;
  display: flex;
  position: relative;
  padding: 0 1rem;
}

.message-avatar {
  width: 30px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.user-avatar {
  background-color: #5436da;
}

.bot-avatar {
  background-color: var(--primary-color);
}

.user-message {
  justify-content: flex-start;
}

.bot-message {
  background-color: rgba(53, 55, 64, 0.2);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
}

.message-content {
  max-width: calc(100% - 45px);
  width: 100%;
  padding-top: 4px;
}

.message-text {
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.chat-input-container {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-wrapper {
  display: flex;
  position: relative;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  background-color: var(--user-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
}

.chat-input {
  width: 100%;
  max-width: 768px;
}

.chat-input form {
  display: flex;
  width: 100%;
}

.chat-input input {
  flex: 1;
  padding: 0.875rem 3.25rem 0.875rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  background-color: transparent;
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.5;
  font-family: var(--font-sans);
  resize: none;
  width: 100%;
}

.chat-input input:focus {
  outline: none;
}

.chat-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.send-button {
  position: absolute;
  right: 0.75rem;
  bottom: 50%;
  transform: translateY(50%);
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #40414f;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #565869;
}

.send-button:enabled {
  background-color: var(--primary-color);
}

.send-button:enabled:hover {
  background-color: #0e916f;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #40414f;
}

.send-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-footer {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.75rem;
  max-width: 768px;
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  color: var(--light-text-color);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-state h2 {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.3;
  max-width: 600px;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.empty-description {
  max-width: 500px;
  font-size: 0.95rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.loading-indicator {
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem 0;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--light-text-color);
  border-radius: 50%;
  animation: bounce 1.4s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style> 