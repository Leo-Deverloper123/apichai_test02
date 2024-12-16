# React useCallback Hook และ UserProfile Component Testing

## useCallback คืออะไร?
`useCallback` เป็น React Hook ที่ใช้สำหรับ memoize ฟังก์ชัน โดยมีวัตถุประสงค์หลักดังนี้:

1. **Performance Optimization**
   - ป้องกันการสร้างฟังก์ชันใหม่ในทุกๆ การ render
   - เหมาะสำหรับการส่งฟังก์ชันเป็น props ไปยัง child components ที่ใช้ React.memo
   - ช่วยลด unnecessary re-renders ของ child components

2. **ป้องกัน Infinite Loops**
   - ใช้ในกรณีที่ต้องการส่งฟังก์ชันเป็น dependency ใน useEffect
   - ป้องกันการเกิด infinite re-renders เมื่อฟังก์ชันถูกสร้างใหม่ทุกครั้งที่ component render

### ตัวอย่างการใช้ useCallback
```javascript
const MyComponent = () => {
  const [count, setCount] = useState(0);

  // ไม่ใช้ useCallback - ฟังก์ชันจะถูกสร้างใหม่ทุกครั้งที่ render
  const handleClick = () => {
    setCount(count + 1);
  };

  // ใช้ useCallback - ฟังก์ชันจะถูกสร้างใหม่เฉพาะเมื่อ count เปลี่ยน
  const handleClickMemoized = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <ChildComponent onClickHandler={handleClickMemoized} />
  );
};
```

### เมื่อไหร่ควรใช้ useCallback?
1. เมื่อส่งฟังก์ชันเป็น props ไปยัง child component ที่ใช้ React.memo
2. เมื่อใช้ฟังก์ชันเป็น dependency ใน useEffect
3. เมื่อฟังก์ชันมีการคำนวณที่ซับซ้อนและใช้ทรัพยากรมาก

### ข้อควรระวัง
1. ไม่จำเป็นต้องใช้ useCallback กับทุกฟังก์ชัน
2. การใช้ useCallback มากเกินไปอาจทำให้โค้ดซับซ้อนและยากต่อการบำรุงรักษา
3. ควรใช้เมื่อมีปัญหาด้าน performance จริงๆ เท่านั้น

## เกี่ยวกับโปรเจกต์นี้
โปรเจกต์นี้ประกอบด้วย:
- UserProfile Component สำหรับแสดงข้อมูลผู้ใช้
- Unit Tests ที่ครอบคลุม 4 กรณีทดสอบ
  1. การแสดงสถานะ Loading
  2. การแสดงข้อมูลผู้ใช้เมื่อ fetch สำเร็จ
  3. การแสดงข้อความ error เมื่อ fetch ล้มเหลว
  4. การ refetch ข้อมูลเมื่อ userId prop เปลี่ยนแปลง

### การติดตั้งและรันเทส
```bash
# ติดตั้ง dependencies
npm install

# รันเทส
npm test
```
