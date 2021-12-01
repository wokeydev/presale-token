const waitUntilTransactionsMined = (txn_hashes) => {
  var transactionReceiptAsync;
  const interval = 500;
  transactionReceiptAsync = function(txn_hashes, resolve, reject) {
    try {
      var receipt = web3.eth.getTransactionReceipt(txn_hashes);
      if (receipt == null) {
        setTimeout(function () {
          transactionReceiptAsync(txn_hashes, resolve, reject);
        }, interval);
      } else {
        resolve(receipt);
      }
    } catch(e) {
      reject(e);
    }
  };
  
  if (Array.isArray(txn_hashes)) {
    var promises = [];
    txn_hashes.forEach(function (tx_hash) {
      promises.push(waitUntilTransactionsMined(tx_hash));
    });
    return Promise.all(promises);
  } 
  else {
    return new Promise(function (resolve, reject) {transactionReceiptAsync(txn_hashes, resolve, reject);});
  }
}

const inBaseUnits = (tokens) => {
  const number = tokens * (10 ** 18);
  return number.toString();
}

const expectInvalidOwner = async (promise) => {
  try {
    await promise;
  }
  catch (error) {
    expect(error.message).to.include('Ownable: caller is not the owner')
    return;
  }
  expect.fail('Expected throw not received');
}

const expectInvalidSubtraction = async (promise) => {
  try {
    await promise;
  }
  catch (error) {
    expect(error.message).to.include('SafeMath: subtraction overflow')
    return;
  }
  expect.fail('Expected throw not received');
}

module.exports = {
  inBaseUnits,
  waitUntilTransactionsMined,
  expectInvalidOwner,
  expectInvalidSubtraction,
};
