<template>
  <div class="car-carousel">
    <div class="carousel-header">
      <h3>{{ aiMessage || `Bu ${cars.length} maşın gözləntilərinizə uyğundur` }}</h3>
      <div class="carousel-controls">
        <button @click="prevSlide" :disabled="currentIndex === 0" class="control-btn">
          ← Əvvəlki
        </button>
        <span class="pagination">{{ Math.min(currentIndex + 1, Math.max(1, cars.length - slidesPerView + 1)) }} / {{ Math.max(1, cars.length - slidesPerView + 1) }}</span>
        <button @click="nextSlide" :disabled="currentIndex >= cars.length - slidesPerView" class="control-btn">
          Sonraki →
        </button>
      </div>
    </div>
    
    <div class="carousel-container">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }">
        <div v-for="(car, index) in cars" :key="index" class="carousel-slide">
          <div class="car-card">
            <div class="car-image">
              <img v-if="car.image || car.image_url" :src="car.image || car.image_url" :alt="car.title" />
              <div v-else class="no-image">No Image Available</div>
            </div>
            <div class="car-details">
              <h3 class="car-title">{{ car.title }}</h3>
              <div class="car-info">
                <div class="info-row">
                  <span class="info-label">Price:</span>
                  <span class="info-value">{{ car.price }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Year:</span>
                  <span class="info-value">{{ car.year }}</span>
                </div>
                <div class="info-row" v-if="car.details">
                  <span class="info-label">Details:</span>
                  <span class="info-value">{{ car.details }}</span>
                </div>
                <div class="info-row" v-if="car.mileage">
                  <span class="info-label">Mileage:</span>
                  <span class="info-value">{{ car.mileage }} km</span>
                </div>
                <div class="info-row" v-if="car.location_date">
                  <span class="info-label">Location:</span>
                  <span class="info-value">{{ car.location_date }}</span>
                </div>
                <div class="info-row" v-if="car.engine_volume">
                  <span class="info-label">Engine:</span>
                  <span class="info-value">{{ car.engine_volume }} cc</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Source:</span>
                  <span class="info-value">
                    <span v-if="getSourceLabel(car.link || car.url)" class="source-label">{{ getSourceLabel(car.link || car.url) }}</span>
                    <span v-else>Other</span>
                  </span>
                </div>
              </div>
              <a :href="car.link || car.url" target="_blank" class="view-btn">Maşına bax</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarCarousel',
  props: {
    cars: {
      type: Array,
      required: true
    },
    aiMessage: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentIndex: 0,
      slidesPerView: 4
    };
  },
  mounted() {
    this.updateSlidesPerView();
    window.addEventListener('resize', this.updateSlidesPerView);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateSlidesPerView);
  },
  methods: {
    updateSlidesPerView() {
      const width = window.innerWidth;
      if (width < 768) {
        this.slidesPerView = 1;
      } else if (width < 1024) {
        this.slidesPerView = 2;
      } else if (width < 1280) {
        this.slidesPerView = 3;
      } else {
        this.slidesPerView = 4;
      }
    },
    nextSlide() {
      const newIndex = this.currentIndex + this.slidesPerView;
      if (newIndex < this.cars.length) {
        this.currentIndex = newIndex;
      } else {
        this.currentIndex = Math.max(0, this.cars.length - this.slidesPerView);
      }
    },
    prevSlide() {
      const newIndex = this.currentIndex - this.slidesPerView;
      if (newIndex >= 0) {
        this.currentIndex = newIndex;
      } else {
        this.currentIndex = 0;
      }
    },
    getSourceLabel(url) {
      if (!url) return null;
      
      if (url.includes('avtostop.tv')) {
        return 'AvtoStop';
      } else if (url.includes('turbo.az')) {
        return 'Turbo.az';
      } else if (url.includes('ap.ge')) {
        return 'AutoPapa';
      }
      
      return null;
    }
  }
};
</script>

<style>
.car-carousel {
  width: 100%;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.carousel-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  background-color: var(--user-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  transition: var(--transition-smooth);
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.control-btn:hover:not(:disabled) {
  background-color: rgba(64, 65, 79, 0.9);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination {
  font-size: 0.875rem;
  color: var(--light-text-color);
  padding: 0 0.25rem;
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  width: 100%;
}

.carousel-slide {
  min-width: 100%;
  flex: 0 0 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .carousel-slide {
    min-width: 50%;
    flex: 0 0 50%;
  }
}

@media (min-width: 1024px) {
  .carousel-slide {
    min-width: 33.333%;
    flex: 0 0 33.333%;
  }
}

@media (min-width: 1280px) {
  .carousel-slide {
    min-width: 25%;
    flex: 0 0 25%;
  }
}

.car-card {
  display: flex;
  flex-direction: column;
  background-color: rgba(32, 33, 35, 0.5);
  border-radius: 0.375rem;
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.car-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  position: relative;
  background-color: rgba(0, 0, 0, 0.2);
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.car-image:hover img {
  transform: scale(1.05);
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--light-text-color);
  font-style: italic;
  opacity: 0.7;
}

.car-details {
  padding: 0.75rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.car-details::-webkit-scrollbar {
  width: 4px;
}

.car-details::-webkit-scrollbar-track {
  background: transparent;
}

.car-details::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.car-title {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.car-info {
  flex: 1;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  overflow-y: auto;
  max-height: 150px;
}

.info-row {
  display: flex;
  margin-bottom: 0.35rem;
  font-size: 0.825rem;
  align-items: center;
}

.info-label {
  font-weight: 500;
  width: 70px;
  color: var(--light-text-color);
}

.info-value {
  flex: 1;
  color: var(--text-color);
}

.view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
  text-align: center;
  transition: var(--transition-smooth);
  align-self: flex-start;
  font-size: 0.875rem;
  font-weight: 500;
}

.view-btn:hover {
  background-color: #0e916f;
}

.source-label {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--light-text-color);
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.25rem;
}
</style> 