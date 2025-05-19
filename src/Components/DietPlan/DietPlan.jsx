import React, { useState } from 'react';
import styles from './DietPlan.module.css';

function DietPlan() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('vegetarian');

  // خطط نباتية
  const vegetarianPlans = [
    {
      id: 1,
      name: "خطة نباتية 1100 سعرة حرارية",
      emoji: "🥦",
      description: "منخفضة جداً في السعرات وغنية بالألياف.",
      calories: 1100,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست أسمر + أفوكادو", calories: 200 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 350 },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية + سلطة خضراء", calories: 400 },
        { type: "سناك", emoji: "🍎", content: "تفاحة", calories: 150 }
      ],
      totalCalories: 1100
    },
    {
      id: 2,
      name: "خطة نباتية 1200 سعرة حرارية",
      emoji: "🥒",
      description: "غنية بالبروتين النباتي ومنخفضة الدهون.",
      calories: 1200,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + حليب لوز + موز", calories: 250 },
        { type: "الغداء", emoji: "🥗", content: "سلطة عدس + خبز أسمر", calories: 400 },
        { type: "العشاء", emoji: "🌽", content: "ذرة مشوية + سلطة خضراء", calories: 400 },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 150 }
      ],
      totalCalories: 1200
    },
    {
      id: 3,
      name: "خطة نباتية 1250 سعرة حرارية",
      emoji: "🥕",
      description: "مناسبة للدايت السريع.",
      calories: 1250,
      meals: [
        { type: "الإفطار", emoji: "🥯", content: "توست + زبدة فول سوداني", calories: 250 },
        { type: "الغداء", emoji: "🥗", content: "سلطة فاصوليا + خبز أسمر", calories: 400 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار", calories: 400 },
        { type: "سناك", emoji: "🍇", content: "عنب", calories: 200 }
      ],
      totalCalories: 1250
    },
    {
      id: 4,
      name: "خطة نباتية 1300 سعرة حرارية",
      emoji: "🥬",
      description: "غنية بالمعادن والفيتامينات.",
      calories: 1300,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + مكسرات + فواكه", calories: 300 },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا + حمص", calories: 400 },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية + سلطة خضراء", calories: 400 },
        { type: "سناك", emoji: "🍓", content: "فراولة", calories: 200 }
      ],
      totalCalories: 1300
    },
    {
      id: 5,
      name: "خطة نباتية 1350 سعرة حرارية",
      emoji: "🥑",
      description: "غنية بالدهون الصحية.",
      calories: 1350,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست + أفوكادو + طماطم", calories: 300 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 400 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار مشوي", calories: 400 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 250 }
      ],
      totalCalories: 1350
    },
    {
      id: 6,
      name: "خطة نباتية 1400 سعرة حرارية",
      emoji: "🌽",
      description: "مناسبة للدايت المتوسط.",
      calories: 1400,
      meals: [
        { type: "الإفطار", emoji: "🥯", content: "توست + زبدة فول سوداني + موز", calories: 350 },
        { type: "الغداء", emoji: "🥗", content: "سلطة فاصوليا + خبز أسمر", calories: 500 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + صوص طماطم وخضار", calories: 400 },
        { type: "سناك", emoji: "🍇", content: "عنب", calories: 150 }
      ],
      totalCalories: 1400
    },
    {
      id: 7,
      name: "خطة نباتية 1450 سعرة حرارية",
      emoji: "🥦",
      description: "غنية بالبروتين النباتي.",
      calories: 1450,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + حليب لوز + موز", calories: 350 },
        { type: "الغداء", emoji: "🥗", content: "سلطة عدس + خبز أسمر", calories: 500 },
        { type: "العشاء", emoji: "🌽", content: "ذرة مشوية + سلطة خضراء", calories: 400 },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 200 }
      ],
      totalCalories: 1450
    },
    {
      id: 8,
      name: "خطة نباتية 1500 سعرة حرارية",
      emoji: "🥕",
      description: "متوازنة وغنية بالمعادن.",
      calories: 1500,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + مكسرات + فواكه", calories: 400 },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا + حمص + خضار مشوي", calories: 500 },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية + سلطة خضراء", calories: 400 },
        { type: "سناك", emoji: "🍓", content: "فراولة", calories: 200 }
      ],
      totalCalories: 1500
    },
    {
      id: 9,
      name: "خطة نباتية 1550 سعرة حرارية",
      emoji: "🥬",
      description: "غنية بالطاقة للنشاط العالي.",
      calories: 1550,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست + أفوكادو + طماطم", calories: 400 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 500 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار مشوي", calories: 500 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 150 }
      ],
      totalCalories: 1550
    },
    {
      id: 10,
      name: "خطة نباتية 1600 سعرة حرارية",
      emoji: "🥑",
      description: "غنية بالدهون الصحية.",
      calories: 1600,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست + أفوكادو + طماطم", calories: 350 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 500 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار مشوي", calories: 500 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 250 }
      ],
      totalCalories: 1600
    },
    {
      id: 11,
      name: "خطة نباتية 1700 سعرة حرارية",
      emoji: "🌽",
      description: "مناسبة للدايت المتوسط.",
      calories: 1700,
      meals: [
        { type: "الإفطار", emoji: "🥯", content: "توست + زبدة فول سوداني + موز", calories: 400 },
        { type: "الغداء", emoji: "🥗", content: "سلطة فاصوليا + خبز أسمر", calories: 600 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + صوص طماطم وخضار", calories: 500 },
        { type: "سناك", emoji: "🍇", content: "عنب", calories: 200 }
      ],
      totalCalories: 1700
    },
    {
      id: 12,
      name: "خطة نباتية 1750 سعرة حرارية",
      emoji: "🥦",
      description: "غنية بالبروتين النباتي.",
      calories: 1750,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + حليب لوز + موز", calories: 350 },
        { type: "الغداء", emoji: "🥗", content: "سلطة عدس + خبز أسمر", calories: 600 },
        { type: "العشاء", emoji: "🌽", content: "ذرة مشوية + سلطة خضراء", calories: 600 },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 200 }
      ],
      totalCalories: 1750
    },
    {
      id: 13,
      name: "خطة نباتية 1800 سعرة حرارية",
      emoji: "🥕",
      description: "مناسبة للرياضيين النباتيين.",
      calories: 1800,
      meals: [
        { type: "الإفطار", emoji: "🥯", content: "توست + زبدة فول سوداني + موز", calories: 400 },
        { type: "الغداء", emoji: "🥗", content: "سلطة فاصوليا + خبز أسمر", calories: 700 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + صوص طماطم وخضار", calories: 600 },
        { type: "سناك", emoji: "🍇", content: "عنب", calories: 100 }
      ],
      totalCalories: 1800
    },
    {
      id: 14,
      name: "خطة نباتية 1850 سعرة حرارية",
      emoji: "🥬",
      description: "غنية بالمعادن والفيتامينات.",
      calories: 1850,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + مكسرات + فواكه", calories: 400 },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا + حمص", calories: 600 },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية + سلطة خضراء", calories: 600 },
        { type: "سناك", emoji: "🍓", content: "فراولة", calories: 250 }
      ],
      totalCalories: 1850
    },
    {
      id: 15,
      name: "خطة نباتية 1900 سعرة حرارية",
      emoji: "🥑",
      description: "غنية بالدهون الصحية.",
      calories: 1900,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست + أفوكادو + طماطم", calories: 400 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 700 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار مشوي", calories: 600 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 200 }
      ],
      totalCalories: 1900
    },
    {
      id: 16,
      name: "خطة نباتية 1950 سعرة حرارية",
      emoji: "🥦",
      description: "غنية بالألياف والطاقة.",
      calories: 1950,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست أسمر + أفوكادو + طماطم", calories: 400 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 700 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار مشوي", calories: 700 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 150 }
      ],
      totalCalories: 1950
    },
    {
      id: 17,
      name: "خطة نباتية 2025 سعرة حرارية",
      emoji: "🥒",
      description: "مناسبة للنشاط العالي.",
      calories: 2025,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + مكسرات + فواكه", calories: 500 },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا + حمص + خضار مشوي", calories: 800 },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية + سلطة خضراء", calories: 600 },
        { type: "سناك", emoji: "🍓", content: "فراولة", calories: 125 }
      ],
      totalCalories: 2025
    },
    {
      id: 18,
      name: "خطة نباتية 2100 سعرة حرارية",
      emoji: "🥕",
      description: "غنية بالبروتين النباتي.",
      calories: 2100,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست + أفوكادو + طماطم", calories: 500 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 800 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار مشوي", calories: 700 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100 }
      ],
      totalCalories: 2100
    },
    {
      id: 19,
      name: "خطة نباتية 2250 سعرة حرارية",
      emoji: "🥬",
      description: "غنية بالطاقة للنشاط العالي.",
      calories: 2250,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست + أفوكادو + طماطم", calories: 600 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 900 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + خضار مشوي", calories: 600 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 150 }
      ],
      totalCalories: 2250
    },
    {
      id: 20,
      name: "خطة نباتية 2400 سعرة حرارية",
      emoji: "🌽",
      description: "مناسبة للرياضيين النباتيين.",
      calories: 2400,
      meals: [
        { type: "الإفطار", emoji: "🥯", content: "توست + زبدة فول سوداني + موز", calories: 600 },
        { type: "الغداء", emoji: "🥗", content: "سلطة فاصوليا + خبز أسمر", calories: 900 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة قمح كامل + صوص طماطم وخضار", calories: 700 },
        { type: "سناك", emoji: "🍇", content: "عنب", calories: 200 }
      ],
      totalCalories: 2400
    }
  ];

  // خطط غير نباتية
  const nonVegetarianPlans = [
    {
      id: 101,
      name: "خطة 1200 سعرة حرارية",
      emoji: "🍗",
      description: "منخفضة السعرات وغنية بالبروتين.",
      calories: 1200,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست", calories: 250 },
        { type: "الغداء", emoji: "🍗", content: "صدر دجاج + رز", calories: 500 },
        { type: "العشاء", emoji: "🥙", content: "تونة + سلطة", calories: 350 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100 }
      ],
      totalCalories: 1200
    },
    {
      id: 102,
      name: "خطة 1250 سعرة حرارية",
      emoji: "🍖",
      description: "غنية بالبروتين الحيواني.",
      calories: 1250,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيضتين + جبنة + خبز", calories: 300 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 600 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 250 },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 100 }
      ],
      totalCalories: 1250
    },
    {
      id: 103,
      name: "خطة 1300 سعرة حرارية",
      emoji: "🍔",
      description: "مناسبة للدايت المتوسط.",
      calories: 1300,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك + عسل + حليب", calories: 350 },
        { type: "الغداء", emoji: "🍔", content: "برجر دجاج + بطاطس + عصير", calories: 600 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة + دجاج + سلطة", calories: 250 },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة + مكسرات", calories: 100 }
      ],
      totalCalories: 1300
    },
    {
      id: 104,
      name: "خطة 1350 سعرة حرارية",
      emoji: "🍤",
      description: "غنية بالبروتين ومنخفضة الدهون.",
      calories: 1350,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست + جبنة", calories: 350 },
        { type: "الغداء", emoji: "🍤", content: "جمبري مشوي + أرز بني", calories: 600 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش تونة + سلطة", calories: 300 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100 }
      ],
      totalCalories: 1350
    },
    {
      id: 105,
      name: "خطة 1400 سعرة حرارية",
      emoji: "🍖",
      description: "مناسبة للرياضيين.",
      calories: 1400,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيضتين + جبنة + خبز", calories: 350 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 700 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 250 },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 100 }
      ],
      totalCalories: 1400
    },
    {
      id: 106,
      name: "خطة 1450 سعرة حرارية",
      emoji: "🍗",
      description: "غنية بالبروتين ومتوازنة.",
      calories: 1450,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست", calories: 350 },
        { type: "الغداء", emoji: "🍗", content: "صدر دجاج + رز + سلطة", calories: 700 },
        { type: "العشاء", emoji: "🥙", content: "تونة + سلطة", calories: 300 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100 }
      ],
      totalCalories: 1450
    },
    {
      id: 107,
      name: "خطة 1500 سعرة حرارية",
      emoji: "🍔",
      description: "مناسبة لزيادة الكتلة العضلية.",
      calories: 1500,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك + عسل + حليب", calories: 400 },
        { type: "الغداء", emoji: "🍔", content: "برجر دجاج + بطاطس + عصير", calories: 700 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة + دجاج + سلطة", calories: 300 },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة + مكسرات", calories: 100 }
      ],
      totalCalories: 1500
    },
    {
      id: 108,
      name: "خطة 1550 سعرة حرارية",
      emoji: "🍖",
      description: "غنية بالبروتين والطاقة.",
      calories: 1550,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيضتين + جبنة + خبز", calories: 400 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 800 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 200 },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 150 }
      ],
      totalCalories: 1550
    },
    {
      id: 109,
      name: "خطة 1600 سعرة حرارية",
      emoji: "🍗",
      description: "متوازنة وغنية بالبروتين.",
      calories: 1600,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "3 بيض + خبز + جبنة", calories: 500 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + بطاطس + سلطة", calories: 800 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 200 },
        { type: "سناك", emoji: "🍏", content: "تفاحة + مكسرات", calories: 100 }
      ],
      totalCalories: 1600
    },
    {
      id: 110,
      name: "خطة 1650 سعرة حرارية",
      emoji: "🍖",
      description: "غنية بالطاقة للنشاط العالي.",
      calories: 1650,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "4 بيض + خبز + جبنة", calories: 600 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 800 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 150 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100 }
      ],
      totalCalories: 1650
    },
    {
      id: 111,
      name: "خطة 1700 سعرة حرارية",
      emoji: "🍗",
      description: "غنية بالبروتين ومتوازنة.",
      calories: 1700,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست", calories: 400 },
        { type: "الغداء", emoji: "🍗", content: "صدر دجاج + رز + سلطة", calories: 900 },
        { type: "العشاء", emoji: "🥙", content: "تونة + سلطة", calories: 300 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100 }
      ],
      totalCalories: 1700
    },
    {
      id: 112,
      name: "خطة 1800 سعرة حرارية",
      emoji: "🍖",
      description: "مناسبة لزيادة الكتلة العضلية.",
      calories: 1800,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك + عسل + حليب", calories: 500 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 900 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 300 },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة + مكسرات", calories: 100 }
      ],
      totalCalories: 1800
    },
    {
      id: 113,
      name: "خطة 1850 سعرة حرارية",
      emoji: "🍔",
      description: "غنية بالبروتين والطاقة.",
      calories: 1850,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيضتين + جبنة + خبز", calories: 400 },
        { type: "الغداء", emoji: "🍔", content: "برجر دجاج + بطاطس + عصير", calories: 900 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة + دجاج + سلطة", calories: 400 },
        { type: "سناك", emoji: "🍏", content: "تفاحة + مكسرات", calories: 150 }
      ],
      totalCalories: 1850
    },
    {
      id: 114,
      name: "خطة 1925 سعرة حرارية",
      emoji: "🍤",
      description: "غنية بالبروتين ومنخفضة الدهون.",
      calories: 1925,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست + جبنة", calories: 400 },
        { type: "الغداء", emoji: "🍤", content: "جمبري مشوي + أرز بني", calories: 900 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش تونة + سلطة", calories: 400 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 225 }
      ],
      totalCalories: 1925
    },
    {
      id: 115,
      name: "خطة 2025 سعرة حرارية",
      emoji: "🍖",
      description: "مناسبة للرياضيين.",
      calories: 2025,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيضتين + جبنة + خبز", calories: 500 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 1000 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 400 },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 125 }
      ],
      totalCalories: 2025
    },
    {
      id: 116,
      name: "خطة 2100 سعرة حرارية",
      emoji: "🍗",
      description: "غنية بالبروتين ومتوازنة.",
      calories: 2100,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست", calories: 500 },
        { type: "الغداء", emoji: "🍗", content: "صدر دجاج + رز + سلطة", calories: 1100 },
        { type: "العشاء", emoji: "🥙", content: "تونة + سلطة", calories: 400 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100 }
      ],
      totalCalories: 2100
    },
    {
      id: 117,
      name: "خطة 2250 سعرة حرارية",
      emoji: "🍖",
      description: "غنية بالطاقة للنشاط العالي.",
      calories: 2250,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "4 بيض + خبز + جبنة", calories: 700 },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 1100 },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 300 },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 150 }
      ],
      totalCalories: 2250
    },
    {
      id: 118,
      name: "خطة 2400 سعرة حرارية",
      emoji: "🍔",
      description: "مناسبة للرياضيين المحترفين.",
      calories: 2400,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك + عسل + حليب", calories: 700 },
        { type: "الغداء", emoji: "🍔", content: "برجر دجاج + بطاطس + عصير", calories: 1100 },
        { type: "العشاء", emoji: "🍝", content: "مكرونة + دجاج + سلطة", calories: 400 },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة + مكسرات", calories: 200 }
      ],
      totalCalories: 2400
    }
  ];

  const plansToShow = activeTab === 'vegetarian' ? vegetarianPlans : nonVegetarianPlans;

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  return (
    <div className={styles.dietPlanPage}>
      <div className={styles.pageTitle}>
        <h1>🥗 خطط التغذية الجاهزة</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <button
          className={activeTab === 'vegetarian' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('vegetarian')}
        >
          🌱 نباتي
        </button>
        <button
          className={activeTab === 'nonVegetarian' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('nonVegetarian')}
          style={{ marginRight: 12 }}
        >
          🍗 غير نباتي
        </button>
      </div>
      <div className={styles.plansContainer}>
        {plansToShow.map(plan => (
          <div key={plan.id} className={styles.planCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 8 }}>
              <span>{plan.emoji}</span>
            </div>
            <h2 style={{ textAlign: 'center', fontSize: '1.2rem', margin: '0 0 8px 0', color: '#2c3e50' }}>{plan.name}</h2>
            <div style={{ textAlign: 'center', color: '#666', fontSize: '0.98rem', marginBottom: 8 }}>{plan.description}</div>
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#FF5722', fontSize: '1.1rem', marginBottom: 12 }}>
              {plan.calories || plan.totalCalories} <span style={{ fontWeight: 'normal', fontSize: '0.95rem' }}>سعرة حرارية</span>
            </div>
            <button
              onClick={() => handleViewPlan(plan)}
              className={styles.viewButton}
              style={{ width: '100%', marginTop: 8 }}
            >
              عرض الخطة
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedPlan && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ direction: "rtl", minWidth: 320 }}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            <h2 style={{ textAlign: "center", marginBottom: 16 }}>{selectedPlan.emoji} {selectedPlan.name}</h2>
            <div style={{ margin: "16px 0" }}>
              {selectedPlan.meals.map((meal, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
                  <span style={{ fontSize: 20, marginLeft: 8 }}>{meal.emoji}</span>
                  <span style={{ minWidth: 70 }}>{meal.type}:</span>
                  <span style={{ margin: "0 8px" }}>{meal.content}</span>
                  <span style={{ color: "#FF5722" }}>{meal.calories} كالوري</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 16, fontWeight: "bold", color: "#FF5722" }}>
               اجمالي السعرات: {selectedPlan.totalCalories}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DietPlan; 