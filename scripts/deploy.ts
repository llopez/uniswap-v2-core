import { ethers } from 'ethers'
import fs from 'fs'
import path from 'path'

async function main() {
  const RPC_URL = process.env.RPC_URL || 'http://localhost:8545'
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  const PRIVATE_KEY = process.env.PRIVATE_KEY
  if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY env var required')
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

  // Load UniswapV2Factory ABI and bytecode
  const factoryJsonPath = path.join(__dirname, '../build/UniswapV2Factory.json')
  const factoryJson = JSON.parse(fs.readFileSync(factoryJsonPath, 'utf8'))
  const abi = factoryJson.abi
  const bytecode = factoryJson.evm.bytecode.object

  // Deploy
  console.log('Deploying UniswapV2Factory...')
  const Factory = new ethers.ContractFactory(abi, bytecode, wallet)
  const factory = await Factory.deploy(wallet.address)
  await factory.deployed()
  console.log('UniswapV2Factory deployed at:', factory.address)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
