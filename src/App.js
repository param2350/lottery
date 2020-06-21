import React, { Component } from 'react';

import './App.css';
import lottery from './lottery';
import web3 from './web3';


setTimeout(_ => {
  if(window.ethereum){
    console.log("hey");
  
    try {
      window.ethereum.enable().then(function() {
  
        console.log('ethereum enable');
      });
  
    }
    catch(e) {
      console.log(e)
    }
  }
  
  else {
    alert('You have to install Metmask!')
  }
}, 5000);

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  
  

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }


  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    console.log(accounts)

    this.setState({ message: "Waiting on transactions success...."});

    console.log(accounts[0]);
    await lottery.methods.enter().send({
      
      value: web3.utils.toWei(this.state.value, 'ether'),
      from: accounts[0]
    });

    this.setState({ message: 'Yo have been entered!'});



     
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transactions success...."});


    await lottery.methods.pickWinner().send({
      from: accounts[0]

    });

    this.setState({ message: "winner has been picked"});

  }

  render() {
    return (
      <div className="col-md-10 col-md-offset-1" >
        <h2>Lottery Contract</h2>
        <br></br>

        <br></br>
        <br></br>

        <p>This contract is managed by {this.state.manager }</p>
        <p>There are currently {this.state.players.length } entered, competing to win { web3.utils.fromWei(this.state.balance , 'ether')} ethers</p>
      

      
      <br></br>
      <form onSubmit={ this.onSubmit } className="form-inline">
        <h4>TRY YOUR LUCK</h4>
        <div className="form-group">
          <label>Amount of ether to enter</label><br></br>
          <input   className="form-control" value = {this.state.value} 
          onChange={event => this.setState({value: event.target.value})}>

          </input>

          <button className="btn btn-primary">Enter</button>
        </div>
      </form>
      <hr></hr>
      <h4>Ready to pick a winner?
        <button onClick={this.onClick}>Pick a Winner</button>
      </h4>

      <hr></hr>

      <h2>{this.state.message }</h2>
      </div>
    )
  }
}




export default App;
