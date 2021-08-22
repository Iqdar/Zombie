import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import ZombieFactory from '../abis/ZombieFactory.json';


class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = ZombieFactory.networks[networkId]
    if(networkData){
      const zombieFactory = new web3.eth.Contract(ZombieFactory.abi, networkData.address)
      this.setState({ zombieFactory })
      const totalZombies = await zombieFactory.methods.totalZombies().call()
      this.setState({totalZombies})
      for (var i = 1; i <= totalZombies; i++) {
        const zombie = await zombieFactory.methods.zombies(i).call()
        this.setState({
          zombies: [...this.state.zombies, zombie]
        })
      }
      this.setState({loading:false})
    }
    else{
      window.alert("Insurance contract not deployed to the current network");
    }
  }

  newZombie(name){
    this.state.zombieFactory.methods.newZombie(name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      console.log('Success')
      window.location.reload(false);
    })
  }

  constructor(props){
    super(props)
    this.state = {
      account:'',
      zombieFactory : null,
      totalZombies : 0,
      zombies: [],
      loading: true
    }
    this.newZombie = this.newZombie.bind(this);
  }


  render() {
    let zombie = this.state.zombies[this.state.totalZombies-1];
    console.log(zombie)
    return (
      <div>
      { this.state.loading
        ? <div>
          <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          </div>
        : <div>
        <p>&nbsp;</p>
            <h2>New Zombie</h2>
            <p>&nbsp;</p>
                <form className="form-horizontal" onSubmit={(event) => {
                    event.preventDefault()
                    const name = this._name.value
                    this.newZombie(name)
                }}>
                <div className="row">
                    <div className="col-md-6">
                    <div className="form-group">
                        <label className="control-label col-sm-12" htmlFor="name">Name:</label>
                        <div className="col-md-10 col-sm-12">
                        <input
                            type="text"
                            ref={(input) => { this._name = input }}
                            className="form-control"
                            placeholder="Name"
                            required />
                        </div>
                    </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">        
                            <div className="col-sm-6 ">
                            <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <p>&nbsp;</p>
            {this.state.totalZombies>0
            ?
            <div><h3><b>Last added: </b>{zombie.name}</h3>
            <h3><b>Head Genre</b> {zombie.dna.substring(0, 2) % 7 + 1}</h3>
            <h3><b>Eye Genre</b> {zombie.dna.substring(2, 4) % 11 + 1}</h3>
            <h3><b>Shirt Genre</b> {zombie.dna.substring(4, 6) % 6 + 1}</h3>
            <h3><b>Skin Color Genre</b> {parseInt(zombie.dna.substring(6, 8) / 100 * 360)}</h3>
            <h3><b>Eye Color Genre</b> {parseInt(zombie.dna.substring(8, 10) / 100 * 360)}</h3>
            <h3><b>Clothes Color Genre</b> {parseInt(zombie.dna.substring(10, 12) / 100 * 360)}</h3>
            </div>
            :
            <div></div>
            }
        </div>
      }
      </div>
    );
  }
}

export default App;
