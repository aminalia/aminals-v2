import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AddSkillProposal } from "../generated/schema"
import { AddSkillProposal as AddSkillProposalEvent } from "../generated/Aminals/Aminals"
import { handleAddSkillProposal } from "../src/aminals"
import { createAddSkillProposalEvent } from "./aminals-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let aminalId = BigInt.fromI32(234)
    let proposalId = BigInt.fromI32(234)
    let skillName = "Example string value"
    let skillAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAddSkillProposalEvent = createAddSkillProposalEvent(
      aminalId,
      proposalId,
      skillName,
      skillAddress,
      sender
    )
    handleAddSkillProposal(newAddSkillProposalEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AddSkillProposal created and stored", () => {
    assert.entityCount("AddSkillProposal", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddSkillProposal",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "aminalId",
      "234"
    )
    assert.fieldEquals(
      "AddSkillProposal",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "proposalId",
      "234"
    )
    assert.fieldEquals(
      "AddSkillProposal",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "skillName",
      "Example string value"
    )
    assert.fieldEquals(
      "AddSkillProposal",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "skillAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AddSkillProposal",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
