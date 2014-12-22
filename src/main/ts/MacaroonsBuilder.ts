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

/// <reference path="../../typings/tsd.d.ts" />

import CaveatPacket = require('./CaveatPacket');
import CaveatPacketType = require('./CaveatPacketType');
import Macaroon = require('./Macaroon');
import MacaroonsConstants = require('./MacaroonsConstants');
import MacaroonsDeSerializer = require('./MacaroonsDeSerializer');
import CryptoTools = require('./CryptoTools');

export = MacaroonsBuilder;

/**
 * Used to build and modify Macaroons
 */
class MacaroonsBuilder {

  "use strict";

  private macaroon:Macaroon = null;

  /**
   * @param location   location
   * @param secretKey  secretKey this secret will be enhanced, in case it's shorter than {@link MacaroonsConstants.MACAROON_SUGGESTED_SECRET_LENGTH}
   * @param identifier identifier
   */
  constructor(location:string, secretKey:string, identifier:string);
  /**
   * @param macaroon macaroon to modify
   */
  constructor(macaroon:Macaroon);
  constructor(arg1:any, secretKey?:string, identifier?:string) {
    if (typeof arg1 === 'string') {
      this.macaroon = this.computeMacaroon_with_keystring(arg1, secretKey, identifier);
    } else {
      this.macaroon = arg1;
    }
  }

  /**
   * @param macaroon macaroon
   * @return {@link MacaroonsBuilder}
   */
  public static modify(macaroon:Macaroon):MacaroonsBuilder {
    return new MacaroonsBuilder(macaroon);
  }

  /**
   * @return a {@link Macaroon}
   */
  public getMacaroon():Macaroon {
    return this.macaroon;
  }

  /**
   * @param location   location
   * @param secretKey  secretKey
   * @param identifier identifier
   * @return {@link Macaroon}
   */
  public static create(location:string, secretKey:string, identifier:string):Macaroon {
    return new MacaroonsBuilder(location, secretKey, identifier).getMacaroon();
  }

  /**
   * @param serializedMacaroon serializedMacaroon
   * @return {@link Macaroon}
   * @throws Exception when serialized macaroon is not valid base64, length is to short or contains invalid packet data
   */
  public static deserialize(serializedMacaroon:string):Macaroon {
    return MacaroonsDeSerializer.deserialize(serializedMacaroon);
  }

  /**
   * @param caveat caveat
   * @return this {@link MacaroonsBuilder}
   * @throws exception if there are more than {@link MacaroonsConstants.MACAROON_MAX_CAVEATS} caveats.
   */
  public add_first_party_caveat(caveat:string):MacaroonsBuilder {
    if (caveat != null) {
      var caveatBuffer:Buffer = new Buffer(caveat, MacaroonsConstants.IDENTIFIER_CHARSET);
      //assert caveatBytes.length < MacaroonsConstants.MACAROON_MAX_STRLEN;
      if (this.macaroon.caveatPackets.length + 1 > MacaroonsConstants.MACAROON_MAX_CAVEATS) {
        throw "Too many caveats. There are max. " + MacaroonsConstants.MACAROON_MAX_CAVEATS + " caveats allowed.";
      }
      var signature = CryptoTools.macaroon_hmac(this.macaroon.signatureBuffer, caveatBuffer);
      this.macaroon.caveatPackets.push(new CaveatPacket(CaveatPacketType.cid, caveatBuffer));
      this.macaroon = new Macaroon(this.macaroon.location, this.macaroon.identifier, signature, this.macaroon.caveatPackets);
    }
    return this;
  }

  private computeMacaroon_with_keystring(location:string, secretKey:string, identifier:string):Macaroon {
    return this.computeMacaroon(location, CryptoTools.generate_derived_key(secretKey), identifier);
  }

  private computeMacaroon(location:string, secretKey:Buffer, identifier:string):Macaroon {
    var signature:Buffer = CryptoTools.macaroon_hmac(secretKey, identifier);
    return new Macaroon(location, identifier, signature);
  }

}