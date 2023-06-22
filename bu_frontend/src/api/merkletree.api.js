const axios = require('axios')
const bu_api_url = require('../config.json').bu_api_url

export function getDataProof(id){
    return new Promise(function (resolve, reject){
        axios.get(`${bu_api_url}/tree/data-proof?tree-name=bu_tree&index=${id}`)
        .then((res) => {
            console.log(res.data)
            resolve((res.data));
            //console.log(rootS)
        },
        (err) => {
            console.log(err)
            reject(err);
        })
        
    })
}
export function getTrustedRoot(){
    return new Promise(function (resolve, reject){
        axios.get(`${bu_api_url}/tree/tree-root?tree-name=global_tree`)
        .then((res) => {
            console.log(res.data)
            resolve((res.data));
            //console.log(rootS)
        },
        (err) => {
            console.log(err)
            reject(err);
        })
        
    })
}
export function getTrustedRootLocal(){
    return new Promise(function (resolve, reject){
        axios.get(`${bu_api_url}/tree/tree-root?tree-name=bu_tree`)
        .then((res) => {
            console.log(res.data)
            resolve((res.data));
            //console.log(rootS)
        },
        (err) => {
            console.log(err)
            reject(err);
        })
        
    })
}