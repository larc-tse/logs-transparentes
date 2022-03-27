const express = require('express')
const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
var bodyParser = require('body-parser');

const app = express()
app.use(express.json())
const port = 3000
//mudar a funcao de hash
const tree = new MerkleTree([], SHA256)


app.get('/', (req, res) => {
  res.send('Hello World!' + tree.toString())
})


app.put('/', (req, res) => {
  console.log(req.body)
  
  console.log(req.body.leaves)
  //const leaves = req.leaves 
  //tree.addLeaves(leaves)
  res.json(req.body);
})

app.post('/', (req, res) => {
  console.log(req.body)
  console.log(req.body.leaves)
  const leaves = req.body.leaves 
  tree.addLeaves(leaves.map(x => SHA256(x)))
  console.log(tree.toString())
  res.json(req.body);
})

app.post('/proof', (req, res) => {
  // returns proof
  const root = tree.getRoot().toString('hex')
  const leaf = SHA256(req.body.leaf)
  const proof = tree.getProof(leaf)
  if (tree.verify(proof, leaf, root)){
    res.json(proof)
  }
  else{
    res.send('Proof not found' + tree.toString())
  }
})

// TODO: precisa definir se sera esse formato de retorno
// tree.getLayersAsObject() ou tree.getHexLayersFlat() tambem podem ser uma opçao 
app.get('/tree', (req, res) => {
  console.log(tree.toString())
  res.send(tree.getHexLayers())
})

app.get('/tree/root', (req, res) => {
  const root = tree.getRoot().toString('hex')
  console.log(root)
  res.send(root)
})

app.get('/tree/leaf/:id', (req, res) => {
  // Return a leaf with id equals to id and its proof.
  const leaf = tree.getLeaf(req.params.id).toString('hex')
  const proof = tree.getHexProof(leaf)
  console.log(leaf)
  res.send({
    "id": req.params.id,
    "leaf": leaf,
    "proof": proof
  })
})

app.get('/leaf/:id', (req, res) => {
  // Return a leaf with id equals to id without its proof.
  const leaf = tree.getLeaf(req.params.id).toString('hex')
  console.log(leaf)
  res.send({
    "id": req.params.id,
    "leaf": leaf,
  })
})

app.get('/tree/leaves', (req, res) => {
  const leaves = tree.getHexLeaves()
  console.log(leaves)
  res.send(leaves.map(leaf => {return {"hash": leaf}}))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})