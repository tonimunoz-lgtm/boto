import { 
  ref, 
  push, 
  onValue, 
  set, 
  update,
  query,
  orderByChild
} from 'firebase/database';
import { database } from '../firebase';

// GRUPOS
export const registerGroup = (groupName) => {
  const groupsRef = ref(database, 'groups');
  const newGroupRef = push(groupsRef);
  const groupData = {
    name: groupName,
    timestamp: Date.now(),
    status: 'waiting'
  };
  set(newGroupRef, groupData);
  return newGroupRef.key;
};

export const listenToGroups = (callback) => {
  const groupsRef = ref(database, 'groups');
  const groupsQuery = query(groupsRef, orderByChild('timestamp'));
  onValue(groupsQuery, (snapshot) => {
    const data = snapshot.val();
    const groupsArray = data 
      ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
      : [];
    callback(groupsArray);
  });
};

// ESTADO DEL JUEGO
export const setGameState = (state) => {
  set(ref(database, 'gameState'), state);
};

export const listenToGameState = (callback) => {
  const stateRef = ref(database, 'gameState');
  onValue(stateRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// RECLAMACIONES (LÍNEA/QUINTO)
export const submitClaim = (groupId, groupName, type, numbers) => {
  const claimsRef = ref(database, 'claims');
  const newClaimRef = push(claimsRef);
  const claimData = {
    groupId,
    groupName,
    type,
    numbers: numbers.join(','),
    status: 'pending',
    timestamp: Date.now()
  };
  set(newClaimRef, claimData);
  return newClaimRef.key;
};

export const listenToClaims = (callback) => {
  const claimsRef = ref(database, 'claims');
  onValue(claimsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const claimsArray = Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => b.timestamp - a.timestamp);
      callback(claimsArray[0] || null); // Última reclamación
    }
  });
};

export const updateClaimStatus = (claimId, status) => {
  set(ref(database, `claims/${claimId}/status`), status);
};

export const listenToClaimUpdates = (claimId, callback) => {
  const claimRef = ref(database, `claims/${claimId}/status`);
  onValue(claimRef, (snapshot) => {
    callback(snapshot.val());
  });
};
