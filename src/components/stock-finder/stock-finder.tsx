import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { AV_API, AV_API_KEY } from '../../global/global';

interface StockInfo {
  name: string;
  symbol: string;
}

@Component({
  tag: 'ps-stock-finder',
  styleUrl: './stock-finder.scss',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: StockInfo[] = [];

  @Event({ bubbles: true, composed: true }) psSymbolSelected: EventEmitter<string>;

  onFindStocks(event: Event) {
    event.preventDefault();

    const stockName = this.stockNameInput.value;
    const url = `${AV_API.getSearch}&keywords=${stockName}&apikey=${AV_API_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        console.log(this.searchResults);
        this.searchResults = parsedRes['bestMatches'].map((match) => {
          return {
            name: match['2. name'],
            symbol: match['1. symbol'],
          };
        });
        console.log(this.searchResults);
      })
      .catch((err) => console.log(err));
  }

  onSelectSymbol(symbol: string) {
    this.psSymbolSelected.emit(symbol);
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id='stock-symbol' ref={(el) => (this.stockNameInput = el)} />
        <button type='submit'>Fetch</button>
      </form>,
      <ul>
        {this.searchResults
          .filter((result) => result.name)
          .map((result) => (
            <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
              <strong>{result.symbol}</strong> - {result.name}
            </li>
          ))}
      </ul>,
    ];
  }
}
