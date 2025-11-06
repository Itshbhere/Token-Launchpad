// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {TokenLauncher} from "./TokenLauncher.sol";
import {Test} from "forge-std/Test.sol";

contract TokenLauncherTest is Test {
    TokenLauncher public token;
    address public owner;
    address public user1;
    address public user2;

    string public constant TOKEN_NAME = "Test Token";
    string public constant TOKEN_SYMBOL = "TEST";
    uint256 public constant INITIAL_SUPPLY = 1000 * 10 ** 18; // 1000 tokens with 18 decimals

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        token = new TokenLauncher(TOKEN_NAME, TOKEN_SYMBOL, 1000);
    }

    function test_Constructor() public view {
        assertEq(token.name(), TOKEN_NAME);
        assertEq(token.symbol(), TOKEN_SYMBOL);
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
    }

    function test_InitialSupply() public view {
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
    }

    function test_Mint() public {
        uint256 mintAmount = 500 * 10 ** 18;

        token.mint(user1, mintAmount);

        assertEq(token.balanceOf(user1), mintAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY + mintAmount);
    }

    function test_Mint_OnlyOwner() public {
        uint256 mintAmount = 500 * 10 ** 18;

        vm.prank(user1);
        vm.expectRevert();
        token.mint(user2, mintAmount);
    }

    function test_Mint_ZeroAmount() public {
        token.mint(user1, 0);
        assertEq(token.balanceOf(user1), 0);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
    }

    function test_Burn() public {
        uint256 burnAmount = 100 * 10 ** 18;
        uint256 initialBalance = token.balanceOf(owner);

        token.burn(burnAmount);

        assertEq(token.balanceOf(owner), initialBalance - burnAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - burnAmount);
    }

    function test_Burn_FromUser() public {
        uint256 transferAmount = 200 * 10 ** 18;
        uint256 burnAmount = 50 * 10 ** 18;

        // Transfer tokens to user1
        token.transfer(user1, transferAmount);
        assertEq(token.balanceOf(user1), transferAmount);

        // User1 burns their tokens
        vm.prank(user1);
        token.burn(burnAmount);

        assertEq(token.balanceOf(user1), transferAmount - burnAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - burnAmount);
    }

    function test_Burn_InsufficientBalance() public {
        uint256 burnAmount = INITIAL_SUPPLY + 1;

        vm.expectRevert();
        token.burn(burnAmount);
    }

    function test_Burn_ZeroAmount() public {
        token.burn(0);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
    }

    function test_Transfer() public {
        uint256 transferAmount = 100 * 10 ** 18;

        token.transfer(user1, transferAmount);

        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - transferAmount);
        assertEq(token.balanceOf(user1), transferAmount);
    }

    function test_Transfer_InsufficientBalance() public {
        uint256 transferAmount = INITIAL_SUPPLY + 1;

        vm.expectRevert();
        token.transfer(user1, transferAmount);
    }

    function test_TransferFrom() public {
        uint256 allowance = 150 * 10 ** 18;
        uint256 transferAmount = 100 * 10 ** 18;

        token.approve(user1, allowance);

        vm.prank(user1);
        token.transferFrom(owner, user2, transferAmount);

        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - transferAmount);
        assertEq(token.balanceOf(user2), transferAmount);
        assertEq(token.allowance(owner, user1), allowance - transferAmount);
    }

    function test_Approve() public {
        uint256 allowance = 200 * 10 ** 18;

        token.approve(user1, allowance);

        assertEq(token.allowance(owner, user1), allowance);
    }

    function testFuzz_Mint(uint256 amount) public {
        // Bound the amount to prevent overflow
        amount = bound(amount, 0, type(uint256).max - token.totalSupply());

        uint256 initialSupply = token.totalSupply();
        token.mint(user1, amount);

        assertEq(token.balanceOf(user1), amount);
        assertEq(token.totalSupply(), initialSupply + amount);
    }

    function testFuzz_Burn(uint256 amount) public {
        // Bound the amount to owner's balance
        amount = bound(amount, 0, token.balanceOf(owner));

        uint256 initialBalance = token.balanceOf(owner);
        uint256 initialSupply = token.totalSupply();

        token.burn(amount);

        assertEq(token.balanceOf(owner), initialBalance - amount);
        assertEq(token.totalSupply(), initialSupply - amount);
    }

    function testFuzz_Transfer(uint256 amount) public {
        // Bound the amount to owner's balance
        amount = bound(amount, 0, token.balanceOf(owner));

        uint256 ownerBalance = token.balanceOf(owner);

        token.transfer(user1, amount);

        assertEq(token.balanceOf(owner), ownerBalance - amount);
        assertEq(token.balanceOf(user1), amount);
    }
}
