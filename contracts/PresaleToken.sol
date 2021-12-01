//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './library/ERC20.sol';
import './library/SafeMath.sol';
import './library/Ownable.sol';

contract PresaleToken is ERC20, Ownable {
  using SafeMath for uint256;

  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  string public constant name = "Royale Presale Token";
  string public constant symbol = "RPT";
  uint8 public constant decimals = 18;
  uint256 public totalSupply;
  bool public mintingFinished = false;

  event Mint(address indexed to, uint256 amount);
  event MintFinished();

  constructor() {}

  function balanceOf(address _owner) external view returns (uint256) {
    return balances[_owner];
  }
    
  function transfer(address _to, uint _value) external returns (bool) {

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);

    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) external returns (bool) {
    uint _allowance = allowed[_from][msg.sender];

    balances[_to] = balances[_to].add(_value);
    balances[_from] = balances[_from].sub(_value);
    allowed[_from][msg.sender] = _allowance.sub(_value);

    emit Transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint _value) external returns (bool) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) external view returns (uint256) {
    return allowed[_owner][_spender];
  }
    
    
  modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * Function to mint tokens
   * @param _to The address that will recieve the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(address _to, uint256 _amount) public onlyOwner canMint returns (bool) {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    emit Mint(_to, _amount);
    return true;
  }

  /**
   * Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() public onlyOwner returns (bool) {
    mintingFinished = true;
    emit MintFinished();
    return true;
  } 
}
