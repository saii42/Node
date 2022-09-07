
exports.combine = async (msgString1, msgString2)=>{
  let hash1 = [...msgString.hashOne];
  let hash2 = [...msgString.hashTwo];
  console.log(hash1);
  console.log(hash2);

  console.log(hash1 + hash2);

  // let comMsg = '';
  // for(let i=0; i<hash_1.length; i++){
  //   if(i == hash_1.length-1){
  //     if(hash_2.length<hash_1.length) comMsg = comMsg+hash_1[i];
  //     else if(hash_3.length<hash_1.length) comMsg = comMsg+hash_1[i]+hash_2[i];
  //   }else{
  //     comMsg = comMsg+hash_1[i]+hash_2[i]+hash_3[i];
  //   }
  // }
  // let hashlength = hash1.length + hash2.length;
  // let msg='';
  // msg = hash1[0]+hash2[0];


  // var hash;

  //   for(let i=0; i<cryptogram.length; i++){
  //   switch(i%2){
  //     case 0:
  //       hashOne = hashOne.concat(cryptogram[i]);
  //       break;
  //     case 1:
  //       hashTwo = hashTwo.concat(cryptogram[i]);
  //       break;
  //     default:
  //       console.log('what is this?', i%2);
  //       break;
  //   }
  // }

  // for(let i=1;i<hashlength;i++)
  // {
  //   hash = hashOne.concat(cryptogram[i]);

  //   msg = msg+hash1[i]+hash2[i]
  // }
  // console.log("msg : "+ msg);

}
