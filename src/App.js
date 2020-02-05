import React from 'react';
import './App.css';
import { candles } from './data.json';
import moment from 'moment';

export class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      balance: 10000.0,
      tick: 0,
      transactions: [],
    };

    this.short = this.short.bind(this);
    this.long = this.long.bind(this);
    this.adjustBalance = this.adjustBalance.bind(this);
  }

  short(candle) {
    const transactions = this.state.transactions;
    transactions.push({
      time: candle.datetime,
      price: candle.close,
      side: 'short'
    })
    this.setState({tick: this.state.tick + 1});
    this.setState({transactions});
    this.adjustBalance();
  }

  long(candle) {
    const transactions = this.state.transactions;
    transactions.push({
      time: candle.datetime,
      price: candle.close,
      side: 'long'
    })
    this.setState({tick: this.state.tick + 1});
    this.setState({transactions});
    this.adjustBalance();
  }

  adjustBalance() {
    const change = this.state.transactions.map(t => (
      t.side === 'long'
      ? candles[this.state.tick].close - t.price
      : t.price - candles[this.state.tick].close
    )).reduce((a,b) => a + b, 0);

    this.setState({balance: this.state.balance + change});
  }

  render () {
    const rows = candles.slice(0, this.state.tick + 1).map((candle, index) => {
      return <tr key={`candle-${candle.datetime}`}>
        <td>{moment(candle.datetime).format('YYYY-MM-DD hh:mm')}</td>
        <td>{candle.open}</td>
        <td>{candle.low}</td>
        <td>{candle.high}</td>
        <td>{candle.close}</td>
        <td>{candle.volume}</td>
        <td>
          {
            this.state.tick === index ? <div>
              <button className="short" onClick={() => { this.short(candle) }}>Short</button>
              <button className="long" onClick={() => { this.long(candle) }}>Long</button>
            </div>
            : null
          }
        </td>
      </tr>
    });

    const transactions = this.state.transactions.map((t) => (
      <tr key={`transaction-${t.time}`}>
        <td>{moment(t.time).format('YYYY-MM-DD hh:mm')}</td>
        <td>${t.price}</td>
        <td>{t.side}</td>
      </tr>
    ));
    return (
      <div>
        <div className="App">
          <h1>trading room</h1>
          <div className="balance">Balance: ${this.state.balance}</div>
          <div><small>Times are your local computer time.</small></div>

          <div className="row">
            <div>
              <h3>Ticks</h3>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Open</th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Close</th>
                    <th>Volume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
            <div>
              <h3>Transactions</h3>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Side</th>
                  </tr>
                </thead>
                <tbody>{transactions}</tbody>
              </table>
            </div>
          </div>

        </div>
        <div className="footer">Author <a href="https://fivetwentysix.com">fivetwentysix</a></div>
      </div>
    );
  }
}

export default App;