import { ethers } from 'hardhat';
import { arrayify, parseEther, randomBytes, solidityKeccak256, solidityPack, soliditySha256 } from "ethers/lib/utils";
import { setup } from "./__setup";

describe("Nesting Moonbirds", () => {
    let ENV: any;
    before(async () => {
        ENV = await setup();

        const { user001, user002, user003 } = ENV;
        const nonce1 = randomBytes(32)
        const signPayload1 = solidityPack(['address', 'bytes32'], [user001.address, nonce1]);
        await user001.Moonbirds.mintPublic(
            user001.address,
            nonce1,
            await (await ethers.getSigner(user001.address)).signMessage(signPayload1),
            {value: parseEther('2.5')}
        );
    });

    it("should nest", async () => {
    });

    it("should unnest", async () => {
    });
});

