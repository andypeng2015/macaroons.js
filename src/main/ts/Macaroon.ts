/*
 * Copyright 2014 Martin W. Kirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export = Macaroon;

import CaveatPacket = require('./CaveatPacket');
import MacaroonsSerializer = require('./MacaroonsSerializer');

class Macaroon {

  public location:string;
  public identifier:string;
  public signature:string;
  public signatureBuffer:Buffer;

  public caveatPackets:CaveatPacket[];

  constructor(location:string, identifier:string, signature:string) {
    this.identifier = identifier;
    this.location = location;
    this.signature = signature;
    this.signatureBuffer = new Buffer(signature, 'hex');
  }

  public serialize():string {
  return MacaroonsSerializer.serialize(this);
}

//  Macaroon(String location, String identifier, byte[] signature) {
//  this(location, identifier, new CaveatPacket[0], signature);
//}
//
//Macaroon(String location, String identifier, CaveatPacket[] caveats, byte[] signature) {
//  this.location = location;
//  this.identifier = identifier;
//  this.caveatPackets = caveats;
//  this.signature = bin2hex(signature);
//  this.signatureBytes = signature;
//}

}
