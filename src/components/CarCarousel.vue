<template>
  <div class="car-carousel">
    <div class="carousel-header">
      <h3>Found {{ cars.length }} car suggestions</h3>
      <div class="carousel-controls">
        <button @click="prevSlide" :disabled="currentIndex === 0" class="control-btn">
          ← Previous
        </button>
        <span class="pagination">{{ currentIndex + 1 }} / {{ cars.length }}</span>
        <button @click="nextSlide" :disabled="currentIndex === cars.length - 1" class="control-btn">
          Next →
        </button>
      </div>
    </div>
    
    <div class="carousel-container">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
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
              </div>
              <a :href="car.link || car.url" target="_blank" class="view-btn">View Car</a>
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
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {
    nextSlide() {
      if (this.currentIndex < this.cars.length - 1) {
        this.currentIndex++;
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
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
  gap: 1rem;
}

.carousel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--primary-color);
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  background-color: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination {
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.carousel-slide {
  min-width: 100%;
  flex: 0 0 100%;
}

.car-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .car-card {
    flex-direction: row;
  }
}

.car-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  background-color: #f0f0f0;
}

@media (min-width: 768px) {
  .car-image {
    width: 40%;
    height: auto;
  }
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--light-text-color);
  font-style: italic;
}

.car-details {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.car-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: var(--text-color);
}

.car-info {
  flex: 1;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-label {
  font-weight: 600;
  width: 80px;
  color: var(--light-text-color);
}

.info-value {
  flex: 1;
}

.view-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.3s;
  align-self: flex-start;
}

.view-btn:hover {
  background-color: #0d8c6d;
}
</style> 