const PresaleToken = artifacts.require('./PresaleToken.sol');

const helpers = require('../scripts/helpers.js');

let chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

contract('PresaleToken', (accounts) => {
  const firstInvestor = accounts[1];
  const secondInvestor = accounts[2];
  const receiver = accounts[3];
  const hacker = accounts[4];

  let token;
  let params;
  let wallet;
  let owner;
  let units;

  describe('Token', () => {
    beforeEach(async () => {
      wallet = '0x8d39c80b2c4da233dab03e0640d7be5377379bfd';
      token = await PresaleToken.new();
      owner = await token.owner.call();
      units = helpers.inBaseUnits(10);
    });

    it('should start with a totalSupply of 0', async () => {
      let totalSupply = await token.totalSupply();
      totalSupply = totalSupply.toNumber();
      totalSupply.should.be.equal(0);
    });

    it('should return mintingFinished false after construction', async () => {
      const mintingFinished = await token.mintingFinished();
      mintingFinished.should.be.false;
    });

    it('should be mintable by owner contract', async () => {
      units = helpers.inBaseUnits(10);

      const txn = await token.mint(receiver, units, {from: owner, gas: 1000000});
      await helpers.waitUntilTransactionsMined(txn.tx);
      let receiverBalance = await token.balanceOf(receiver);

      receiverBalance = receiverBalance.toString();
      receiverBalance.should.be.equal(units);
    });

    it('should not be mintable by non-owner contract', async () => {
      units = helpers.inBaseUnits(10);
      params = { from: hacker, gas: 100000 };

      await helpers.expectInvalidOwner(token.mint(receiver, units, params));

      hackerBalance = await token.balanceOf(hacker);
      hackerBalance = hackerBalance.toNumber();
      hackerBalance.should.be.equal(0);
    });

    it('should be transferable ', async () => {
      units = helpers.inBaseUnits(50);

      const txn_1 = await token.mint(firstInvestor, units, { from: owner, gas: 1000000 });
      await helpers.waitUntilTransactionsMined(txn_1.tx);

      const firstInvestorBalanceBefore = await token.balanceOf(firstInvestor);
      const secondInvestorBalanceBefore = await token.balanceOf(secondInvestor);
      
      const txn_2 = await token.transfer(secondInvestor, units, { from: firstInvestor, gas: 1000000 });
      await helpers.waitUntilTransactionsMined(txn_2.tx);

      const firstInvestorBalanceAfter = await token.balanceOf(firstInvestor);
      const secondInvestorBalanceAfter = await token.balanceOf(secondInvestor);

      const firstInvestorBalanceDifference = firstInvestorBalanceAfter - firstInvestorBalanceBefore;
      const secondInvestorBalanceDifference = secondInvestorBalanceAfter - secondInvestorBalanceBefore;

      firstInvestorBalanceDifference.should.be.equal(parseInt(-units));
      secondInvestorBalanceDifference.should.be.equal(parseInt(units));
    });

    it('should not allow to transfer more than balance', async () => {
      const investorBalance = await token.balanceOf(firstInvestor);
      const txn = await token.mint(firstInvestor, investorBalance + 1, { from: owner, gas: 1000000 });
      await helpers.waitUntilTransactionsMined(txn.tx);

      params = { from: firstInvestor, gas: 100000 };
      await helpers.expectInvalidSubtraction(token.transfer(secondInvestor, units, params));
    });
  });
});
