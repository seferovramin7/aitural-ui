<template>
  <div class="app">
    <header class="header">
      <div class="container">
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
            </div>
            
            <div v-for="(message, index) in messages" :key="index" 
                 :class="['message', message.type === 'user' ? 'user-message' : 'bot-message']">
              <div class="message-content">
                <div v-if="message.type === 'user'">{{ message.text }}</div>
                <div v-else-if="message.type === 'bot' && message.cars && message.cars.length > 0">
                  <car-carousel :cars="message.cars" />
                </div>
                <div v-else-if="message.type === 'bot' && message.text">{{ message.text }}</div>
                <div v-else-if="message.type === 'loading'" class="loading-indicator">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <form @submit.prevent="sendMessage">
              <input 
                type="text" 
                v-model="userInput" 
                placeholder="Describe your car requirements..." 
                :disabled="loading"
              />
              <button type="submit" class="btn" :disabled="loading || !userInput.trim()">
                <span v-if="!loading">Send</span>
                <span v-else>...</span>
              </button>
            </form>
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
          'Accept': 'application/json'
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
          
          console.log('Received response from backend:', response.data);
          
          // Remove loading message
          this.messages.pop();
          
          // Add bot response with cars
          this.messages.push({
            type: 'bot',
            cars: response.data
          });
        } catch (proxyError) {
          console.error('Proxy API error:', proxyError);
          
          // Try with direct URL as fallback
          const directResponse = await customAxios.post('http://52.90.3.212:8080/api/cars/suggestion', {
            text: userQuery
          });
          
          console.log('Direct API response:', directResponse.data);
          
          // Remove loading message
          this.messages.pop();
          
          // Add bot response with cars
          this.messages.push({
            type: 'bot',
            cars: directResponse.data
          });
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
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.chat-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--chat-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 250px);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--light-text-color);
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.message {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.user-message .message-content {
  align-self: flex-end;
  background-color: var(--user-bg);
  border-radius: 12px 12px 0 12px;
  padding: 0.75rem 1rem;
  max-width: 80%;
}

.bot-message .message-content {
  align-self: flex-start;
  background-color: var(--bot-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px 12px 12px 0;
  padding: 0.75rem 1rem;
  max-width: 100%;
  width: 100%;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: var(--light-text-color);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
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
  }
  40% {
    transform: scale(1);
  }
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.chat-input form {
  display: flex;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.chat-input button {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}
</style> 