'use client';

import { useEffect, useState } from 'react';
import Container from '../(Layouts)/Container';
import TeamContainer from './TeamContainer';

const DisplayGroups = ({ setRefresh, refresh }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [_error, setError] = useState(null);

  const loadGroups = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/group/public`);
      const { groups } = await response.json();
      setGroups(groups);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Hiba történt az adatok lekérdezése közben.');
    }
  };

  useEffect(() => {
    loadGroups();
  }, [refresh]);

  return loading ? (
    <p className="w-full text-center">Betöltés...</p>
  ) : groups && groups.length > 0 ? (
    groups.map((group, idx) => (
      <Container key={idx} className={'relative p-5'}>
        <TeamContainer setRefresh={setRefresh} group={group} />
      </Container>
    ))
  ) : (
    <p className="w-full text-center">Egy csoport sem található.</p>
  );
};

export default DisplayGroups;
