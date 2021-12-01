const PresaleToken = artifacts.require("PresaleToken");
const Presale = artifacts.require("Presale");

const wallet = '0xe2b3204f29ab45d5fd074ff02ade098fbc381d42';
const minInvestment = '1000000000000000000';
const tokenCap = 295257;
const rate = 20;
const gas = 3*10**6;
const gasPrice = 40*10**9;

module.exports = async function (deployer, _network) {
  await deployer.deploy(PresaleToken);
  const presaleToken = await PresaleToken.deployed();
  await deployer.deploy(Presale, wallet, minInvestment, tokenCap, rate, {gas: gas, gasPrice: gasPrice });
  const presale = await Presale.deployed();
};
