<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                @keydown.enter="onlyTickers"
                type="text"
                name="wallet"
                id="wallet"
                autocomplete="off"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>
            <template v-if="validCoins.length">
              <input
                v-for="(coin, idx) of validCoins"
                v-model="validCoins[idx].Symbol"
                :key="coin.Id"
                :data-id="idx"
                @click="addTickerAuto(validCoins[idx].Symbol)"
                type="button"
                class="my-4 inline-flex items-center mx-0.5 py-0.5 px-2 border border-transparent shadow-sm text-xs leading-4 font-medium rounded-full text-black bg-gray-300 hover:bg-gray-400 transition-colors duration-300 focus:outline-none cursor-pointer"
              />
              <hr class="w-full border-t border-gray-300" />
            </template>
            <p v-if="alert" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </p>
          </div>
        </div>
        <button
          @click="onlyTickers"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>
      <template v-if="tickers.length">
        <div>
          <hr class="w-full border-t border-gray-600 my-4" />
          <button
            class="mx- 4 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            :disabled="page <= 1"
            @click="page--"
          >
            Назад
          </button>
          <button
            class="mx-4 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            :disabled="filteredTickers.length <= endPage"
            @click="page++"
          >
            Вперёд
          </button>
          <div>
            <label>
              Фильтр:
              <input
                v-model="filter"
                class="mx-1 mt-1 relative rounded-md shadow-md"
              />
            </label>
          </div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <div class="px-4 py-5 sm:p-6 text-center" v-if="emptyState">
          <p class="text-sm font-medium text-gray-500 truncate">
            Не найденно криптовалют по фильтру: "{{ filter }}"
          </p>
        </div>
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="(t, idx) of paginatedTickers"
            :key="idx"
            @click="select(t)"
            :class="{ 'border-4': selectedTicker === t }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="removeTicker(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section class="relative" v-if="selectedTicker">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.name }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="(bar, idx) of normalizeBar"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click="selectedTicker = ''"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background:new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { loadCoinList, subscribeToTicker, unsubscribeFromTicker } from "./api";

export default {
  name: "App",
  data() {
    return {
      ticker: "",
      tickers: [],
      selectedTicker: "",
      graph: [],
      alert: false,
      coinList: {},
      validCoins: [],
      cardCoin: null,
      page: 1,
      filter: "",
      emptyState: false
    };
  },
  computed: {
    normalizeBar() {
      const maxGraphValue = Math.max(...this.graph);
      const minGraphValue = Math.min(...this.graph);
      return this.graph.map(price =>
        maxGraphValue === minGraphValue
          ? 50
          : 5 + ((price - minGraphValue) * 95) / (maxGraphValue - minGraphValue)
      );
    },

    tickerUpper() {
      return this.ticker.toUpperCase();
    },

    filterUpper() {
      return this.filter.toUpperCase();
    },

    addedTicker() {
      return Object.keys(this.coinList).includes(this.tickerUpper)
        ? this.tickerUpper
        : this.validCoins[0].Symbol;
    },

    filteredTickers() {
      return this.tickers.filter(t => t.name.includes(this.filterUpper));
    },

    startPage() {
      return (this.page - 1) * 6;
    },

    endPage() {
      return this.page * 6;
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startPage, this.endPage);
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },
  methods: {
    formatPrice(price) {
      if (typeof price === "number") {
        return price > 1 ? +price.toFixed(2) : +price.toPrecision(2);
      } else {
        return price;
      }
    },
    updateTickers(tickerName, price) {
      this.tickers
        .filter(t => t.name === tickerName)
        .forEach(t => (t.price = price));
    },

    addTicker() {
      const newTicker = reactive({
        name: this.addedTicker,
        price: "-"
      });
      this.tickers = [...this.tickers, newTicker];
      subscribeToTicker(newTicker.name, price =>
        this.updateTickers(newTicker.name, price)
      );
    },

    removeTicker(ticker) {
      this.tickers = this.tickers.filter(t => t !== ticker);
      if (this.selectedTicker === ticker) this.selectedTicker = "";
      unsubscribeFromTicker(ticker.name);
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    onlyTickers() {
      if (this.tickers.map(t => t.name).includes(this.addedTicker)) {
        this.alert = true;
        this.ticker = this.addedTicker;
      } else {
        this.addTicker();
      }
    },

    addTickerAuto(coin) {
      this.ticker = coin;
      this.onlyTickers();
    }
  },

  watch: {
    filteredTickers() {
      this.emptyState = !this.filteredTickers.length;
    },

    selectedTicker() {
      this.graph = [];
    },

    paginatedTickers() {
      if (!this.paginatedTickers.length && this.page > 1) this.page -= 1;
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions(value) {
      history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },

    ticker(value) {
      if (!value) {
        this.validCoins = [];
        this.filter = "";
      } else {
        this.validCoins = Object.values(this.coinList)
          .filter(
            t =>
              t.Symbol.match(new RegExp(this.tickerUpper)) ||
              t.FullName.match(new RegExp(this.ticker))
          )
          .slice(0, 4);
      }
      this.alert = false;
    },

    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
      this.ticker = "";
    }
  },

  async created() {
    const tickersData = localStorage.getItem("cryptonomicon-list");

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach(ticker => {
        subscribeToTicker(ticker.name, price =>
          this.updateTickers(ticker.name, price)
        );
      });
    }
    const { Data } = await loadCoinList();
    this.coinList = Data;

    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    const VALID_KEYS = ["filter", "page"];
    VALID_KEYS.forEach(key => (this[key] = windowData[key]));
  }
};
</script>
