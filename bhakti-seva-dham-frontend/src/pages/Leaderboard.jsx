import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

export default function Leaderboard() {
  const [topDevotees, setTopDevotees] = useState([]);

  useEffect(() => {
    const quizData = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
    const japData = JSON.parse(localStorage.getItem('jap_leaderboard') || '[]');
    
    const devoteesMap = {};

    quizData.forEach(item => {
      if (item && item.name) {
        const key = item.name.trim().toLowerCase();
        devoteesMap[key] = { 
          name: item.name.trim(), 
          score: Number(item.score) || 0 
        };
      }
    });

    japData.forEach(item => {
      if (item && item.name) {
        const key = item.name.trim().toLowerCase();
        if (devoteesMap[key]) {
          devoteesMap[key].score += Number(item.score) || 0;
        } else {
          devoteesMap[key] = { 
            name: item.name.trim(), 
            score: Number(item.score) || 0 
          };
        }
      }
    });

    let combinedList = Object.values(devoteesMap);

    if (combinedList.length === 0) {
      combinedList = [
        { name: "Kiran auti", score: 122 },
        { name: "Anjali Sharma", score: 118 },
        { name: "Binu.I", score: 119 },
        { name: "Sechela auti", score: 145 },
        { name: "Souali Sharma", score: 123 },
        { name: "Barti Radha", score: 128 },
        { name: "Gojali Sharma", score: 158 },
        { name: "Autri Hobai", score: 168 }
      ];
    }

    combinedList.sort((a, b) => b.score - a.score);
    setTopDevotees(combinedList);
  }, []);

  const winner = topDevotees[0] || { name: "Devotee", score: 0 };
  const remainingDevotees = topDevotees.slice(1, 10);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '36px 20px 48px',
      color: '#38232c',
      fontFamily: '"Segoe UI", Arial, sans-serif',
      background: 'linear-gradient(140deg, #fff9f7, #fcf1f4 55%, #fff8ec)'
    }}>
      <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid #e8c99b',
            borderRadius: '50px',
            background: '#fffaf0',
            color: '#501629',
            fontSize: '11px',
            fontWeight: '750',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            boxShadow: '0 3px 10px rgba(123, 38, 63, 0.04)'
          }}>
            <Sparkles size={14} />
            <span>Saptahik Combined Leaderboard</span>
          </div>
          <h1 style={{
            margin: '17px 0 9px',
            color: '#501629',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '34px',
            fontWeight: '700'
          }}>Top Devotees Ranking</h1>
          <p style={{
            maxWidth: '500px',
            margin: '0 auto',
            color: '#897780',
            fontSize: '14px',
            lineHeight: '1.7'
          }}>Daily Quiz aur Naam Jap sadhana ke adhar par top bhakto ki soochi</p>
        </div>

        {/* 1st Place Winner Card */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px',
          marginBottom: '23px',
          padding: '23px',
          border: '1px solid #cba968',
          borderRadius: '18px',
          background: 'linear-gradient(120deg, #501629, #7b263f 65%, #963d55)',
          color: '#ffffff',
          boxShadow: '0 10px 28px rgba(80, 22, 41, 0.13)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              display: 'grid',
              placeItems: 'center',
              width: '54px',
              height: '54px',
              flexShrink: 0,
              border: '1px solid #e6c77e',
              borderRadius: '15px',
              background: 'linear-gradient(145deg, #fff0bf, #e8c879)',
              color: '#80551b',
              fontSize: '23px',
              fontWeight: '800'
            }}>
              🏆
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#f7e9bf', textTransform: 'uppercase', fontWeight: 700 }}>1st Rank Winner</span>
              <div style={{
                color: '#fff5e9',
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                fontWeight: '700'
              }}>{winner.name}</div>
            </div>
          </div>
          <div style={{
            padding: '10px 15px',
            border: '1px solid #e8ca83',
            borderRadius: '11px',
            background: '#fff2d1',
            color: '#6b431e',
            fontSize: '15px',
            fontWeight: '750',
            whiteSpace: 'nowrap'
          }}>
            {winner.score} Pts
          </div>
        </div>

        {/* Rankings Grid (Ranks 2 to 10) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '14px'
        }}>
          {remainingDevotees.map((devotee, index) => (
            <div key={index} style={{
              padding: '17px',
              border: '1px solid #efdcdf',
              borderRadius: '15px',
              background: 'linear-gradient(145deg, #ffffff, #fffafb)',
              color: '#38232c',
              boxShadow: '0 4px 13px rgba(80, 22, 41, 0.035)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <span style={{
                  display: 'inline-grid',
                  placeItems: 'center',
                  minWidth: '36px',
                  height: '36px',
                  padding: '0 7px',
                  borderRadius: '11px',
                  border: '1px solid #e9d3d8',
                  background: 'linear-gradient(145deg, #fff0f3, #f8dfe6)',
                  color: '#501629',
                  fontSize: '13px',
                  fontWeight: '750'
                }}>#{index + 2}</span>
                <span style={{ color: '#49323b', fontSize: '14px', fontWeight: '650' }}>{devotee.name}</span>
              </div>
              <span style={{
                padding: '7px 10px',
                border: '1px solid #ecd9ad',
                borderRadius: '9px',
                background: '#fff7e5',
                color: '#875d26',
                fontSize: '12px',
                fontWeight: '750'
              }}>{devotee.score} Pts</span>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div style={{
          margin: '30px auto 0',
          color: '#8c7079',
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          fontStyle: 'italic',
          textAlign: 'center',
          lineHeight: '1.8'
        }}>
          ✦ &nbsp; ✧ &nbsp; ✦ <br />
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>

      </div>
    </div>
  );
}