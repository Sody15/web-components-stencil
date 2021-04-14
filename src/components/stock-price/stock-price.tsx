import { Component, Element, h, Listen, Prop, State, Watch } from '@stencil/core';
import { AV_API_KEY, AV_API } from '../../global/global';

@Component({
  tag: 'ps-stock-price',
  styleUrl: './stock-price.scss',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;
  // initialStockSymbol: string;

  @Element() el: HTMLElement;

  @State() price: number = 0;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @State() loading = false;

  @Prop({ mutable: true, reflect: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.stockInputValid = true;
      this.fetchStockPrice(newValue);
    }
  }

  // Lifecycle hooks
  componentWillLoad() {
    console.log('componentWillLoad');
    console.log(this.stockSymbol);
  }

  componentDidLoad() {
    console.log('componentDidLoad');
    if (this.stockSymbol) {
      // this.initialStockSymbol = this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    //   if (this.stockSymbol !== this.initialStockSymbol) {
    //     this.initialStockSymbol = this.stockSymbol;
    //     this.fetchStockPrice(this.stockSymbol);
    //   }
  }

  disconnectedCallback() {
    console.log('disconnectedCallback');
  }

  @Listen('psSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent) {
    console.log('stock symbol selected' + event.detail);
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail;
    }
  }

  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;

    if (this.stockUserInput.trim() !== '' && this.stockUserInput.length > 2) {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();

    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement)?.value;
    this.stockSymbol = this.stockInput.value;
    // this.fetchStockPrice(stockSymbol);
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;

    const url = `${AV_API.getStockPrice}${stockSymbol}&apikey=${AV_API_KEY}`;

    fetch(url)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Invalid');
        }
        return res.json();
      })
      .then((parsedRes) => {
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid Symbol');
        }
        this.error = null;
        this.price = +parsedRes['Global Quote']['05. price'];
        this.loading = false;
      })
      .catch((err) => {
        this.error = err.message;
        this.price = null;
        this.loading = false;
      });
  }

  // Add error class if has error
  hostData() {
    return {
      class: this.error ? 'error' : '',
    };
  }

  render() {
    let dataContent = <p>Please enter a symbol!</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }
    if (this.price) {
      dataContent = <p>Price: ${this.price}</p>;
    }
    if (this.loading) {
      dataContent = <ps-spinner></ps-spinner>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input
          id='stock-symbol'
          ref={(el) => (this.stockInput = el)}
          value={this.stockSymbol}
          onInput={this.onUserInput.bind(this)}
        />
        <button type='submit' disabled={!this.stockInputValid || this.loading}>
          Fetch
        </button>
      </form>,
      <div>{dataContent}</div>,
    ];
  }
}
