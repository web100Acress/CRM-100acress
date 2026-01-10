# Chat Test Scenarios

## Test Cases for Assignment Chain Chat

### Scenario 1: Boss → HOD
**Expected:** Boss ↔ HOD chat should work
- Boss clicks WhatsApp button → Should chat with HOD
- HOD clicks WhatsApp button → Should chat with Boss

**Assignment Chain:**
```
[
  {
    userId: "boss_id",
    name: "Boss",
    role: "boss",
    assignedBy: null
  },
  {
    userId: "hod_id",
    name: "HOD",
    role: "hod",
    assignedBy: { _id: "boss_id", name: "Boss", role: "boss" }
  }
]
```

### Scenario 2: HOD → BD (HOD forwards to BD)
**Expected:** 
- HOD ↔ BD chat should work
- HOD ↔ Boss chat should work (HOD can chat with their assigner)

**Assignment Chain:**
```
[
  {
    userId: "boss_id",
    name: "Boss",
    role: "boss",
    assignedBy: null
  },
  {
    userId: "hod_id",
    name: "HOD",
    role: "hod",
    assignedBy: { _id: "boss_id", name: "Boss", role: "boss" }
  },
  {
    userId: "bd_id",
    name: "BD",
    role: "bd",
    assignedBy: { _id: "hod_id", name: "HOD", role: "hod" }
  }
]
```

**Current Assigned To:** BD
**Tests:**
- HOD clicks WhatsApp → Should show BD as recipient
- BD clicks WhatsApp → Should show HOD as recipient
- Boss clicks WhatsApp → Should NOT chat (not consecutive pair)

### Scenario 3: HOD → TL (HOD forwards to TL)
**Expected:**
- HOD ↔ TL chat should work
- HOD ↔ Boss chat should work (HOD can chat with their assigner)

**Assignment Chain:**
```
[
  {
    userId: "boss_id",
    name: "Boss",
    role: "boss",
    assignedBy: null
  },
  {
    userId: "hod_id",
    name: "HOD",
    role: "hod",
    assignedBy: { _id: "boss_id", name: "Boss", role: "boss" }
  },
  {
    userId: "tl_id",
    name: "TL",
    role: "team-leader",
    assignedBy: { _id: "hod_id", name: "HOD", role: "hod" }
  }
]
```

**Current Assigned To:** TL
**Tests:**
- HOD clicks WhatsApp → Should show TL as recipient (and Boss?)
- TL clicks WhatsApp → Should show HOD as recipient

### Scenario 4: TL → BD (TL assigns to BD)
**Expected:**
- TL ↔ BD chat should work
- TL ↔ HOD chat should work (TL can chat with their assigner)

**Assignment Chain:**
```
[
  {
    userId: "boss_id",
    name: "Boss",
    role: "boss",
    assignedBy: null
  },
  {
    userId: "hod_id",
    name: "HOD",
    role: "hod",
    assignedBy: { _id: "boss_id", name: "Boss", role: "boss" }
  },
  {
    userId: "tl_id",
    name: "TL",
    role: "team-leader",
    assignedBy: { _id: "hod_id", name: "HOD", role: "hod" }
  },
  {
    userId: "bd_id",
    name: "BD",
    role: "bd",
    assignedBy: { _id: "tl_id", name: "TL", role: "team-leader" }
  }
]
```

**Current Assigned To:** BD
**Tests:**
- TL clicks WhatsApp → Should show BD as recipient (and HOD?)
- BD clicks WhatsApp → Should show TL as recipient

### Scenario 5: TL → HOD (TL forwards back to HOD)
**Expected:**
- TL ↔ HOD chat should work

**Assignment Chain:** (same as Scenario 4)
**Current Assigned To:** HOD (if forwarded back)
**Tests:**
- TL clicks WhatsApp → Should show HOD as recipient
- HOD clicks WhatsApp → Should show TL as recipient (consecutive in chain)

## Current Logic Issues to Check

1. **HOD → BD case:**
   - HOD should be able to chat with BD (assigned user)
   - HOD should also be able to chat with Boss (their assigner)
   - Current code might only allow one recipient

2. **Multiple consecutive pairs:**
   - In chain Boss → HOD → TL → BD
   - HOD should chat with both Boss (previous) and TL (next)
   - TL should chat with both HOD (previous) and BD (next)

3. **Currently assigned user:**
   - If HOD assigned to BD, and BD is currently assigned
   - HOD should be able to chat with BD (their assignee)
   - BD should be able to chat with HOD (their assigner)

## Test Implementation

Run these tests in browser console after setting up test data.

