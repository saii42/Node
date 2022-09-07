exports.division = async (msg) => {
  let cryptogram = [...msg];
  let hashOne = '',
    hashTwo = '';

  for (let i = 0; i < cryptogram.length; i++) {
    switch (i % 2) {
      case 0:
        hashOne = hashOne.concat(cryptogram[i]);
        break;
      case 1:
        hashTwo = hashTwo.concat(cryptogram[i]);
        break;
      default:
        console.log('what is this?', i % 2);
        break;
    }
  }
  return [hashOne, hashTwo]
}


exports.combine = async (hkey0, hkey1) => {

  let hash_1 = [...hkey0];
  let hash_2 = [...hkey1];

  console.log(hash_1);
  console.log(hash_2);


  let comMsg = '';
  for (let i = 0; i < hash_1.length; i++) {
    if (i == hash_1.length - 1)
      if (hash_2.length < hash_1.length) comMsg = comMsg + hash_1[i];
      else comMsg = comMsg + hash_1[i] + hash_2[i];

  }
}