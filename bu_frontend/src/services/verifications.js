import {getRoot,getDataProof,getBuById, getTrustedRoot} from './services.js';
import initPyodide from './pyodide.js';
export async function verifySingleData(id){
    let bubyid=await getBuById(id);
    let root=await getTrustedRoot();
    let proofData=await getDataProof(id);
    if (proofData.local_tree.inclusion_proof.metadata.security) {
      proofData.local_tree.inclusion_proof.metadata.security = 'True';
    } else {
      proofData.local_tree.inclusion_proof.metadata.security = 'False';
    }
    
    if (proofData.data.inclusion_proof.metadata.security) {
      proofData.data.inclusion_proof.metadata.security = 'True';
    } else {
      proofData.data.inclusion_proof.metadata.security = 'False';
    }
    const pyodide = await initPyodide();
    root=JSON.stringify(root)
    bubyid=JSON.stringify(bubyid)
    proofData=JSON.stringify(proofData)
    const pythonCode = `
    from tlverifier.merkle_functions.tl_functions import verify_single_data
    import requests
    import json
    def func():
      proofData=str(${proofData})
      proofData=proofData.replace("'",'"') 
      proofData=json.loads(proofData)
      #Definindo true do javascript como True do python
      if proofData['local_tree']['inclusion_proof']['metadata']['security'] == 'True':
        proofData['local_tree']['inclusion_proof']['metadata']['security'] = True
      else:
        proofData['local_tree']['inclusion_proof']['metadata']['security'] = False
      if proofData['data']['inclusion_proof']['metadata']['security'] == 'True':
        proofData['data']['inclusion_proof']['metadata']['security'] = True
      else:
        proofData['data']['inclusion_proof']['metadata']['security'] = False
      bu=str(${bubyid})
      bu=bu.replace("'",'@')
      bu=bu.replace('"',"'")
      bu=bu.replace("@",'"')
      bu=json.loads(bu)
      root=str(${root})
      root=root.replace("'",'"') 
      root=json.loads(root)
      verifyresult =verify_single_data(proofData, root['value'],bytes(bu['bu_inteiro'],'utf-8'))
      return str(verifyresult)
    func()
  `;
    return await pyodide.runPythonAsync(pythonCode);}