import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import ZombieOwnership from '../abis/ZombieOwnership.json';

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
    const networkData = ZombieOwnership.networks[networkId]
    if(networkData){
      const zombieOwnership = new web3.eth.Contract(ZombieOwnership.abi, networkData.address)
      this.setState({ zombieOwnership })
      const totalZombies = await zombieOwnership.methods.totalZombies().call()
      this.setState({totalZombies})
      let zombiesByOwners = [ ...this.state.zombiesByOwners ];
      for (var i = 1; i <= totalZombies; i++) {
        const zombie = await zombieOwnership.methods.zombies(i).call()
        const zombieOwner = await zombieOwnership.methods.zombieOwner(i).call()
        const zombiesByOwner = await zombieOwnership.methods.getZombiesByOwner(zombieOwner).call()
        zombiesByOwners[zombieOwner] = zombiesByOwner;
        this.setState({ zombiesByOwners });        
        this.setState({
          zombies: [...this.state.zombies, zombie],
          zombieOwners: [...this.state.zombieOwners, zombieOwner]
        })
        console.log(this.state.zombies[0])
      }
      this.setState({loading:false})
      console.log(this.getOwner(1))
      zombieOwnership.events.Transfer({ filter: { _to: this.state.account } })
        .on("data", function(event) {
          let data = event.returnValues;
          console.log(this.getZombiesByOwner(this.state.account));
        }).on("error", console.error);
    }
    else{
      window.alert("Insurance contract not deployed t1o the current network");
    }
  }

  getZombie(id){
    return this.state.zombies[id]
  }

  getOwner(id){
    return this.state.zombieOwners[id-1]
  }

  getOwnerZombies(address){
    const x = this.state.zombiesByOwners[address];
    return x
  }

  newZombie(name){
    this.state.zombieOwnership.methods.newZombie(name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      console.log('Success')
      window.location.reload(false);
    })
  }

  feedOnKitty(zombieId, kittyId) {
    this.state.zombieOwnership.methods.feedOnKitty(zombieId, kittyId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      console.log('Success')
      console.log(this.getOwnerZombies(this.state.account))
    })
  }

  levelUp(zombieId){
    this.state.zombieOwnership.methods.levelUp(zombieId)
    .send({ from: this.state.account, value: Web3.utils.toWei("0.001", "ether") })
    .once('receipt', (receipt) => {
      console.log('Successfully leveled up')
    })
  }

  constructor(props){
    super(props)
    this.state = {
      data:'',
      account:'',
      zombieOwnership : null,
      totalZombies : 0,
      zombies: [],
      zombieOwners: [],
      zombiesByOwners: [],
      loading: true
    }
    this.getZombie = this.getZombie.bind(this)
    this.getOwner = this.getOwner.bind(this);
    this.newZombie = this.newZombie.bind(this);
    this.getOwnerZombies = this.getOwnerZombies.bind(this)
  }


  render() {
console.log(this.getZombie(1))

    let zombie = this.state.zombies[this.state.totalZombies-1];
    console.log(zombie)
    if(this.state.loading){
      return(<div>
        <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        </div>)
    }
    else{
      console.log(this.state.zombiesByOwners.length)
      return (
        <div>
        <div>
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
              
              {this.state.zombies[this.getOwnerZombies(this.state.account)-1]
              ?
              <div>                
                <h3><b>Owner: </b>{this.getOwner(this.getOwnerZombies(this.state.account))}</h3>
                <h3><b>Last Zombie Id from this account: </b>{this.getOwnerZombies(this.state.account)}</h3>
                <h3><b>Name: </b>{this.state.zombies[this.getOwnerZombies(this.state.account)-1].name}</h3>
              <h3><b>Head Genre</b> {this.state.zombies[this.getOwnerZombies(this.state.account)-1].dna.substring(0, 2) % 7 + 1}</h3>
              <h3><b>Eye Genre</b> {this.state.zombies[this.getOwnerZombies(this.state.account)-1].dna.substring(2, 4) % 11 + 1}</h3>
              <h3><b>Shirt Genre</b> {this.state.zombies[this.getOwnerZombies(this.state.account)-1].dna.substring(4, 6) % 6 + 1}</h3>
              <h3><b>Skin Color Genre</b> {parseInt(this.state.zombies[this.getOwnerZombies(this.state.account)-1].dna.substring(6, 8) / 100 * 360)}</h3>
              <h3><b>Eye Color Genre</b> {parseInt(this.state.zombies[this.getOwnerZombies(this.state.account)-1].dna.substring(8, 10) / 100 * 360)}</h3>
              <h3><b>Clothes Color Genre</b> {parseInt(this.state.zombies[this.getOwnerZombies(this.state.account)-1].dna.substring(10, 12) / 100 * 360)} </h3>
              </div>
              :
              <div></div>
              }
          </div>
        </div>
      );
    }
  }
}

export default App;
