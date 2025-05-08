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
    
    <div class="carousel-container" ref="carouselContainer">
      <div class="carousel-wrapper">
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
    
    <div class="carousel-indicators" v-if="totalPages > 1">
      <button 
        v-for="index in totalPages" 
        :key="index" 
        @click="goToPage(index-1)"
        :class="['indicator-dot', {'active': isActivePage(index-1)}]">
      </button>
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
      slidesPerView: 4,
      touchStartX: 0,
      touchEndX: 0,
      isMobile: false
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.cars.length / this.slidesPerView);
    }
  },
  mounted() {
    this.checkMobile();
    this.updateSlidesPerView();
    window.addEventListener('resize', this.handleResize);
    
    // Force initial layout update
    this.$nextTick(() => {
      this.fixMobileLayout();
    });
    
    // Add touch events for mobile swiping
    const carouselTrack = this.$el.querySelector('.carousel-track');
    if (carouselTrack) {
      carouselTrack.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      carouselTrack.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    
    // Remove touch events
    const carouselTrack = this.$el.querySelector('.carousel-track');
    if (carouselTrack) {
      carouselTrack.removeEventListener('touchstart', this.handleTouchStart);
      carouselTrack.removeEventListener('touchend', this.handleTouchEnd);
    }
  },
  methods: {
    fixMobileLayout() {
      if (this.isMobile) {
        const carouselContainer = this.$el.querySelector('.carousel-container');
        const carouselWrapper = this.$el.querySelector('.carousel-wrapper');
        
        if (carouselContainer) {
          // Ensure full width and proper horizontal centering
          carouselContainer.style.width = '100%';
          carouselContainer.style.maxWidth = '100%';
        }
        
        if (carouselWrapper) {
          carouselWrapper.style.width = '100%';
        }
      }
    },
    handleResize() {
      const wasMobile = this.isMobile;
      this.checkMobile();
      this.updateSlidesPerView();
      
      // Handle mobile/desktop transition
      if (wasMobile !== this.isMobile) {
        this.$nextTick(() => {
          this.fixMobileLayout();
        });
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },
    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX;
    },
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    },
    handleSwipe() {
      // Minimum swipe distance (in pixels)
      const minSwipeDistance = 50;
      const swipeDistance = this.touchEndX - this.touchStartX;
      
      // Detect swipe direction
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swipe right - go to previous
          this.prevSlide();
        } else {
          // Swipe left - go to next
          this.nextSlide();
        }
      }
    },
    updateSlidesPerView() {
      const width = window.innerWidth;
      if (width < 480) {
        // Extra small devices
        this.slidesPerView = 1;
      } else if (width < 768) {
        // Small devices
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
      // Move by the number of slides per view
      const newIndex = this.currentIndex + this.slidesPerView;
      if (newIndex < this.cars.length) {
        this.currentIndex = newIndex;
      } else {
        // If going to the end, show the last possible batch
        this.currentIndex = Math.max(0, this.cars.length - this.slidesPerView);
      }
    },
    prevSlide() {
      // Move back by the number of slides per view
      const newIndex = this.currentIndex - this.slidesPerView;
      if (newIndex >= 0) {
        this.currentIndex = newIndex;
      } else {
        // If going back too far, go to the beginning
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
    },
    goToPage(pageIndex) {
      this.currentIndex = pageIndex * this.slidesPerView;
    },
    isActivePage(pageIndex) {
      const currentPage = Math.floor(this.currentIndex / this.slidesPerView);
      return currentPage === pageIndex;
    }
  }
};
</script>

<style>
.car-carousel {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .car-carousel {
    width: 100vw;
    margin-left: -1rem;
    margin-right: -1rem;
    position: relative;
  }
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .carousel-header {
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 0 1.5rem;
  }
  
  .carousel-header h3 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
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

@media (max-width: 768px) {
  .control-btn {
    padding: 0.35rem 0.6rem;
    font-size: 0.8rem;
  }
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
  min-width: 60px;
  text-align: center;
}

@media (max-width: 768px) {
  .pagination {
    font-size: 0.8rem;
    min-width: 50px;
  }
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
}

.carousel-wrapper {
  width: 100%;
  position: relative;
}

@media (max-width: 768px) {
  .carousel-container {
    border-radius: 0;
    border-left: none;
    border-right: none;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  width: 100%;
}

@media (max-width: 480px) {
  .carousel-track {
    transition: transform 0.3s ease-out;
  }
}

.carousel-slide {
  min-width: 100%;
  flex: 0 0 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .carousel-slide {
    padding: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  max-width: 100%;
}

.car-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .car-card {
    border-radius: 0.25rem;
    max-width: 400px;
    width: 100%;
  }
  
  .car-card:hover {
    transform: none;
    box-shadow: none;
  }
}

.car-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  position: relative;
  background-color: rgba(0, 0, 0, 0.2);
}

@media (max-width: 480px) {
  .car-image {
    height: 130px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .car-image {
    height: 140px;
  }
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

@media (max-width: 768px) {
  .car-details {
    padding: 0.5rem 0.75rem;
  }
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

@media (max-width: 768px) {
  .car-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
}

.car-info {
  flex: 1;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  overflow-y: auto;
  max-height: 150px;
}

@media (max-width: 768px) {
  .car-info {
    max-height: 120px;
  }
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

@media (max-width: 768px) {
  .info-row {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  
  .info-label {
    width: 60px;
  }
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

@media (max-width: 768px) {
  .view-btn {
    font-size: 0.8rem;
    padding: 0.35rem 0.6rem;
    border-radius: 0.25rem;
  }
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

.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: var(--transition-smooth);
  border: none;
  padding: 0;
}

.indicator-dot.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

@media (max-width: 480px) {
  .carousel-indicators {
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .indicator-dot {
    width: 6px;
    height: 6px;
    /* Make touch targets bigger while keeping visual size small */
    position: relative;
  }
  
  .indicator-dot:after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
  }
}
</style> 