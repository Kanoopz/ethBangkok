import logo from './logo.svg';
import './App.css';

import React, { useState, useRef } from 'react';
import WaveFile from 'wavefile';

import { IMT } from "@zk-kit/imt";
import { BarretenbergSync, Fr } from "@aztec/bb.js"


import { ethers } from 'ethers';

function App() {

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  ///////////////////////////////////////////////////
  //  "BIOMETRICS"                                ///
  ///////////////////////////////////////////////////
  const startRecording = async () => 
  {
    const bb = await BarretenbergSync.new()

    console.log(" ");
    console.log("//////////////////////////////////////");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = event => 
    {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => 
    {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      audioChunksRef.current = [];
      const arrayBuffer = await audioBlob.arrayBuffer();

      console.log("ARRAY_BUFFER:", arrayBuffer);

      const audioArray = new Uint8Array(arrayBuffer);

      console.log("AUDIO_ARRAY:", audioArray);

      const fingerprint = await generateFingerprint(audioArray);

      console.log("FINGER_PRINT:", fingerprint);

      const secureHash = await generateSecureHash(fingerprint);

      console.log("///BIOMETRIC/////:", secureHash);

      // console.log('Hash seguro almacenado:', secureHash);

      let index = 0;
      let value = 0;
      let leavesArray = [];

      for(index = 0 ; index < 10 ; index++)
      {
        console.log("///////////");
        console.log(" ");

        console.log("BASE_HASH_LEAF: ", secureHash);
        console.log("ACTUAL_VALUE: ", value);

        let leaf = secureHash + value;
        console.log("LEAF: ", leaf);

        let leafHash = await generateSecureHash(leaf);
        console.log("LEAF_HASH: ", leafHash);

        leavesArray.push(leafHash);
        value++;

        console.log(" ");
        console.log("///////////");
      }

      console.log("LEAVES_ARRAY:");
      console.log(leavesArray);

      const hasher = (nodes) => {
        return bb.pedersenHash(nodes.map(val => Fr.fromString(val)), 0).toString()
      }
      const depth = 4
      const arity = 2
      const zeroValue = "0"
      const mt = new IMT(hasher, depth, zeroValue, arity)

      leavesArray.forEach(val => mt.insert(val))

      console.log("ROOT", mt.root);
      console.log("TREE_LEAVES: ", mt.leaves);

      // const proof = mt.createProof(Fr.fromString(leavesArray[1]));
      const proof = mt.createProof(2);
      console.log("PROOF / PATH: ", proof);

    
      //  OZ IMPLEMENTATION //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
      // const tree = StandardMerkleTree.of(leavesArray.map(hash => [hash]), ["string"]);
      // setMerkleTree(tree);
      // console.log("TREE_OBJECT: ", tree);
      // console.log("TREE_ROOT", tree.root);



      // for (const [i, v] of tree.entries()) 
      // {
      //   if (v[0] === '6dbf647ea95ae2eb738e8901dcd28055c45801815261ff4ca4f982a557c20543') 
      //   {
      //     // (3)
      //     const proof = tree.getProof(i);

      //     console.log("INDEX?: ", i);

      //     console.log('Value:', v);
      //     console.log('Proof:', proof);
      //   }
      // }
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    };

    mediaRecorderRef.current.start();
    setIsRecording(true);

    console.log("//////////////////////////////////////");
    console.log(" ");
  };

  const stopRecording = () => 
  {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const verifyVoice = async () => 
  {
    console.log(" ");
    console.log("//////////////////////////////////////");

    console.log(" ");
    console.log("///////////////////////");
    console.log("// VERYFING         ///");
    console.log("///////////////////////");
    console.log("");

    const bb = await BarretenbergSync.new()

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    let verifyAudioChunks = [];

    mediaRecorderRef.current.ondataavailable = event => { verifyAudioChunks.push(event.data); };

    mediaRecorderRef.current.onstop = async () => 
    {
      const verifyAudioBlob = new Blob(verifyAudioChunks, { type: 'audio/wav' });
      verifyAudioChunks = [];
      const verifyArrayBuffer = await verifyAudioBlob.arrayBuffer();

      console.log("ARRAY_BUFFER:", verifyArrayBuffer);

      const newAudioArray = new Uint8Array(verifyArrayBuffer);

      console.log("AUDIO_ARRAY:", newAudioArray);

      const newFingerprint = await generateFingerprint(newAudioArray);
      
      console.log("FINGER_PRINT:", newFingerprint);

      const secureHash = await generateSecureHash(newFingerprint);

      console.log("///BIOMETRIC/////:", secureHash);

      // const isVerified = newSecureHash === storedHash;
      // alert('Verificación: ' + isVerified);

      let index = 0;
      let value = 0;
      let leavesArray = [];

      for(index = 0 ; index < 10 ; index++)
      {
        console.log("///////////");
        console.log(" ");

        console.log("BASE_HASH_LEAF: ", secureHash);
        console.log("ACTUAL_VALUE: ", value);

        let leaf = secureHash + value;
        console.log("LEAF: ", leaf);

        let leafHash = await generateSecureHash(leaf);
        console.log("LEAF_HASH: ", leafHash);

        leavesArray.push(leafHash);
        value++;

        console.log(" ");
        console.log("///////////");
      }

      console.log("LEAVES_ARRAY:");
      console.log(leavesArray);

      const hasher = (nodes) => {
        return bb.pedersenHash(nodes.map(val => Fr.fromString(val)), 0).toString()
      }
      const depth = 4
      const arity = 2
      const zeroValue = "0"
      const mt = new IMT(hasher, depth, zeroValue, arity)

      leavesArray.forEach(val => mt.insert(val))

      console.log("ROOT", mt.root);
      console.log("TREE_LEAVES: ", mt.leaves);

      // const proof = mt.createProof(Fr.fromString(leavesArray[1]));
      const proof = mt.createProof(2);
      console.log("PROOF / PATH: ", proof);


    };

    mediaRecorderRef.current.start();
    setTimeout(() => { mediaRecorderRef.current.stop(); }, 5000); // Grabar durante 5 segundos para la verificación

    console.log("//////////////////////////////////////");
    console.log(" ");
  };

  const generateFingerprint = async (audioArray) => 
  {
    const hashBuffer = await crypto.subtle.digest('SHA-256', audioArray);
    return bufferToHex(hashBuffer);
  };

  const generateSecureHash = async (fingerprint) => 
  {
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
  };

  const bufferToHex = (buffer) => 
  {
    return Fr.fromBufferReduce(buffer).toString()
    // return Array.from(new Uint8Array(buffer))
    //   .map(b => b.toString(16).padStart(2, '0'))
    //   .join('');
  };

  ///////////////////////////////////////////////////
  //  "onChainInteraction"                        ///
  ///////////////////////////////////////////////////



  return (
    <div>
      <header>
        SANDEVYZTAN DEMO
      </header>

      <body>
        <h2>HELLO WORLD!</h2>

        <div>
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>

          <button onClick={verifyVoice}>
            Verify Recording
          </button>
        </div>
      </body>
    </div>
  );
}

export default App;
