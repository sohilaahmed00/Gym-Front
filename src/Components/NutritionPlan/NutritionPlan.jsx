import React, { useState } from 'react';
import styles from './NutritionPlan.module.css';

function NutritionPlan() {
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
        { type: "الإفطار", emoji: "🥑", content: "توست أسمر + أفوكادو", calories: 200, quantityDetails: "1 شريحة توست + نصف حبة أفوكادو" },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 350, quantityDetails: "150 جرام حمص + 50 جرام خبز" },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية + سلطة خضراء", calories: 400, quantityDetails: "200 جرام بطاطا + طبق سلطة" },
        { type: "سناك", emoji: "🍎", content: "تفاحة", calories: 150, quantityDetails: "1 حبة" }
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
        { type: "الإفطار", emoji: "🥣", content: "شوفان + حليب لوز + موز", calories: 250, quantityDetails: "50 جرام شوفان + 200 مل حليب + 1 حبة موز" },
        { type: "الغداء", emoji: "🥗", content: "سلطة عدس + خبز أسمر", calories: 400, quantityDetails: "150 جرام عدس مطبوخ + 50 جرام خبز" },
        { type: "العشاء", emoji: "🌽", content: "ذرة مشوية + سلطة خضراء", calories: 400, quantityDetails: "200 جرام ذرة + طبق سلطة" },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 150, quantityDetails: "1 حبة" }
      ],
      totalCalories: 1200
    },
    {
      id: 3,
      name: "خطة نباتية 1300 سعرة حرارية",
      emoji: "🥕",
      description: "متوازنة وسهلة التحضير.",
      calories: 1300,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك نباتي + شراب قيقب", calories: 300, quantityDetails: "2 بان كيك متوسط + 30 مل شراب" },
        { type: "الغداء", emoji: "🍝", content: "مكرونة بصوص الطماطم والخضار", calories: 500, quantityDetails: "150 جرام مكرونة مطبوخة + 100 جرام خضار + صوص" },
        { type: "العشاء", emoji: "🍲", content: "شوربة خضار + خبز أسمر", calories: 400, quantityDetails: "300 مل شوربة + 50 جرام خبز" },
        { type: "سناك", emoji: "🍓", content: "فراولة", calories: 100, quantityDetails: "100 جرام" }
      ],
      totalCalories: 1300
    },
    {
      id: 4,
      name: "خطة نباتية 1400 سعرة حرارية",
      emoji: "🥔",
      description: "مناسبة لزيادة الوزن بشكل صحي.",
      calories: 1400,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بالحليب والمكسرات", calories: 400, quantityDetails: "60 جرام شوفان + 250 مل حليب + 30 جرام مكسرات" },
        { type: "الغداء", emoji: "🍚", content: "أرز بني + فاصوليا سوداء + أفوكادو", calories: 600, quantityDetails: "150 جرام أرز مطبوخ + 100 جرام فاصوليا + نصف حبة أفوكادو" },
        { type: "العشاء", emoji: "🌮", content: "تاكو نباتي بالخضار", calories: 300, quantityDetails: "2 تاكو متوسط الحجم" },
        { type: "سناك", emoji: "🥜", content: "مكسرات وبذور", calories: 100, quantityDetails: "30 جرام" }
      ],
      totalCalories: 1400
    },
    {
      id: 5,
      name: "خطة نباتية 1500 سعرة حرارية",
      emoji: "🌰",
      description: "غنية بالبروتين والألياف.",
      calories: 1500,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "فول + خبز أسمر", calories: 400, quantityDetails: "200 جرام فول مدمس + 50 جرام خبز" },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا + خضار مشوي", calories: 600, quantityDetails: "150 جرام كينوا مطبوخة + 150 جرام خضار" },
        { type: "العشاء", emoji: "🍲", content: "عدس بجبة + أرز", calories: 400, quantityDetails: "150 جرام عدس + 100 جرام أرز مطبوخ" },
        { type: "سناك", emoji: "🍓", content: "زبادي نباتي + توت", calories: 100, quantityDetails: "100 جرام زبادي + 50 جرام توت" }
      ],
      totalCalories: 1500
    },
    {
      id: 6,
      name: "خطة نباتية 1600 سعرة حرارية",
      emoji: "🍠",
      description: "طاقة مستدامة لليوم.",
      calories: 1600,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "وافل نباتي + فواكه", calories: 400, quantityDetails: "2 وافل صغير + 100 جرام فواكه" },
        { type: "الغداء", emoji: "🌯", content: "بوريتو نباتي بالفاصوليا والأرز", calories: 700, quantityDetails: "1 بوريتو كبير" },
        { type: "العشاء", emoji: "🥔", content: "بطاطا حلوة محشوة بالخضار", calories: 400, quantityDetails: "250 جرام بطاطا + خضار" },
        { type: "سناك", emoji: "🍌", content: "موز + زبدة فول سوداني", calories: 100, quantityDetails: "1 حبة موز + 15 جرام زبدة" }
      ],
      totalCalories: 1600
    },
    {
      id: 7,
      name: "خطة نباتية 1700 سعرة حرارية",
      emoji: "🥜",
      description: "متوازنة للرياضيين النباتيين.",
      calories: 1700,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "سموذي بروتين نباتي + سبانخ", calories: 500, quantityDetails: "300 مل سموذي" },
        { type: "الغداء", emoji: "🍝", content: "باستا عدس + صوص بيستو نباتي", calories: 700, quantityDetails: "200 جرام باستا مطبوخة + صوص" },
        { type: "العشاء", emoji: "🥗", content: "سلطة فلافل + طحينة", calories: 400, quantityDetails: "5-6 حبات فلافل + سلطة + طحينة" },
        { type: "سناك", emoji: "🍏", content: "تفاحة + مكسرات", calories: 100, quantityDetails: "1 حبة تفاح + 15 جرام مكسرات" }
      ],
      totalCalories: 1700
    },
    {
      id: 8,
      name: "خطة نباتية 1800 سعرة حرارية",
      emoji: "🥑",
      description: "غنية بالدهون الصحية والبروتين.",
      calories: 1800,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "توست أفوكادو + طماطم مجففة", calories: 600, quantityDetails: "2 شريحة توست + 1 حبة أفوكادو + طماطم" },
        { type: "الغداء", emoji: "🍚", content: "أرز بني + حمص + خضار مشوي", calories: 800, quantityDetails: "200 جرام أرز مطبوخ + 150 جرام حمص + 150 جرام خضار" },
        { type: "العشاء", emoji: "🍲", content: "شوربة عدس بالشوفان", calories: 300, quantityDetails: "350 مل شوربة" },
        { type: "سناك", emoji: "🍓", content: "فواكه مشكلة", calories: 100, quantityDetails: "150 جرام" }
      ],
      totalCalories: 1800
    },
    {
      id: 9,
      name: "خطة نباتية 1900 سعرة حرارية",
      emoji: "🥦",
      description: "متنوعة ولذيذة.",
      calories: 1900,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بالموز وزبدة الفول السوداني", calories: 500, quantityDetails: "60 جرام شوفان + 1 حبة موز + 30 جرام زبدة فول سوداني" },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا وفاصوليا", calories: 800, quantityDetails: "200 جرام كينوا مطبوخة + 150 جرام فاصوليا + خضار" },
        { type: "العشاء", emoji: "🌮", content: "تاكو نباتي بالخضار والتوفو", calories: 500, quantityDetails: "3 تاكو متوسط + توفو" },
        { type: "سناك", emoji: "🍎", content: "تفاحة + لوز", calories: 100, quantityDetails: "1 حبة تفاح + 15 جرام لوز" }
      ],
      totalCalories: 1900
    },
    {
      id: 10,
      name: "خطة نباتية 2000 سعرة حرارية",
      emoji: "🥒",
      description: "مناسبة للرياضيين النباتيين.",
      calories: 2000,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك بروتين نباتي + توت", calories: 600, quantityDetails: "3 بان كيك متوسط + 100 جرام توت" },
        { type: "الغداء", emoji: "🍝", content: "باستا الحمص + خضار مشوي", calories: 800, quantityDetails: "200 جرام باستا مطبوخة + 150 جرام حمص + 150 جرام خضار" },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية محشوة + سلطة", calories: 500, quantityDetails: "300 جرام بطاطا + حشوة + سلطة" },
        { type: "سناك", emoji: "🍌", content: "موزة + زبدة لوز", calories: 100, quantityDetails: "1 حبة موز + 15 جرام زبدة لوز" }
      ],
      totalCalories: 2000
    },
    {
      id: 11,
      name: "خطة نباتية 2100 سعرة حرارية",
      emoji: "🥕",
      description: "غنية بالطاقة والبروتين.",
      calories: 2100,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "فول + طعمية (مشوية) + خبز أسمر", calories: 600, quantityDetails: "250 جرام فول + 4-5 حبات طعمية + 50 جرام خبز" },
        { type: "الغداء", emoji: "🍚", content: "أرز بني + عدس + خضار مطبوخ", calories: 900, quantityDetails: "200 جرام أرز مطبوخ + 200 جرام عدس + 150 جرام خضار" },
        { type: "العشاء", emoji: "🍲", content: "شوربة خضار بالكريمة النباتية", calories: 500, quantityDetails: "400 مل شوربة" },
        { type: "سناك", emoji: "🍓", content: "فواكه مجففة", calories: 100, quantityDetails: "30 جرام" }
      ],
      totalCalories: 2100
    },
    {
      id: 12,
      name: "خطة نباتية 2200 سعرة حرارية",
      emoji: "🥔",
      description: "لزيادة الوزن بشكل صحي.",
      calories: 2200,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بالحليب كامل الدسم + مكسرات", calories: 700, quantityDetails: "70 جرام شوفان + 300 مل حليب + 40 جرام مكسرات" },
        { type: "الغداء", emoji: "🌯", content: "بوريتو نباتي كبير", calories: 900, quantityDetails: "1 بوريتو كبير جداً" },
        { type: "العشاء", emoji: "🥔", content: "بطاطا حلوة كبيرة محشوة", calories: 500, quantityDetails: "350 جرام بطاطا + حشوة" },
        { type: "سناك", emoji: "🥜", content: "زبدة فول سوداني على توست", calories: 100, quantityDetails: "1 شريحة توست + 15 جرام زبدة" }
      ],
      totalCalories: 2200
    },
    {
      id: 13,
      name: "خطة نباتية 2300 سعرة حرارية",
      emoji: "🌰",
      description: "طاقة عالية للتحمل.",
      calories: 2300,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "وافل نباتي + فواكه + كريمة نباتية", calories: 700, quantityDetails: "3 وافل متوسط + 150 جرام فواكه + كريمة" },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا + حمص + أفوكادو", calories: 1000, quantityDetails: "250 جرام كينوا مطبوخة + 200 جرام حمص + 1 حبة أفوكادو" },
        { type: "العشاء", emoji: "🍝", content: "باستا الخضار بالزيت الزيتون", calories: 500, quantityDetails: "200 جرام باستا + خضار + زيت" },
        { type: "سناك", emoji: "🍌", content: "موزة + زبدة لوز", calories: 100, quantityDetails: "1 حبة موز + 15 جرام زبدة لوز" }
      ],
      totalCalories: 2300
    },
    {
      id: 14,
      name: "خطة نباتية 2400 سعرة حرارية",
      emoji: "🍠",
      description: "مناسبة للرياضيين النباتيين.",
      calories: 2400,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بروتين + توت + مكسرات", calories: 700, quantityDetails: "70 جرام شوفان بروتين + 100 جرام توت + 40 جرام مكسرات" },
        { type: "الغداء", emoji: "🌯", content: "بوريتو نباتي كبير", calories: 1000, quantityDetails: "1 بوريتو ضخم" },
        { type: "العشاء", emoji: "🥔", content: "بطاطا حلوة محشوة بالفاصوليا", calories: 600, quantityDetails: "400 جرام بطاطا + فاصوليا + حشوة" },
        { type: "سناك", emoji: "🍎", content: "تفاحة + زبدة فول سوداني", calories: 100, quantityDetails: "1 حبة تفاح + 15 جرام زبدة فول سوداني" }
      ],
      totalCalories: 2400
    },
    {
      id: 15,
      name: "خطة نباتية 2500 سعرة حرارية",
      emoji: "🥜",
      description: "بناء العضلات للنباتيين.",
      calories: 2500,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "فول + طعمية + خبز + سلطة", calories: 800, quantityDetails: "300 جرام فول + 6-7 حبات طعمية + 60 جرام خبز + سلطة" },
        { type: "الغداء", emoji: "🍝", content: "مكرونة بالعدس والخضار", calories: 1000, quantityDetails: "250 جرام مكرونة + 200 جرام عدس + 200 جرام خضار" },
        { type: "العشاء", emoji: "🍲", content: "شوربة عدس + أرز + سلطة", calories: 600, quantityDetails: "300 مل شوربة + 150 جرام أرز مطبوخ + سلطة" },
        { type: "سناك", emoji: "🍓", content: "فواكه متنوعة + مكسرات", calories: 100, quantityDetails: "100 جرام فواكه + 15 جرام مكسرات" }
      ],
      totalCalories: 2500
    },
    {
      id: 16,
      name: "خطة نباتية 2600 سعرة حرارية",
      emoji: "🥑",
      description: "طاقة عالية جداً للنشاط المكثف.",
      calories: 2600,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك بروتين كبير + فواكه", calories: 800, quantityDetails: "4 بان كيك كبير + 150 جرام فواكه" },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا كبيرة + حمص", calories: 1100, quantityDetails: "300 جرام كينوا مطبوخة + 250 جرام حمص" },
        { type: "العشاء", emoji: "🌮", content: "تاكو نباتي كبير", calories: 600, quantityDetails: "4 تاكو كبير" },
        { type: "سناك", emoji: "🍌", content: "موزتين + زبدة لوز", calories: 100, quantityDetails: "2 حبة موز + 15 جرام زبدة لوز" }
      ],
      totalCalories: 2600
    },
    {
      id: 17,
      name: "خطة نباتية 2700 سعرة حرارية",
      emoji: "🥦",
      description: "زيادة الوزن وبناء العضلات.",
      calories: 2700,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بالمكسرات والفواكه المجففة", calories: 900, quantityDetails: "80 جرام شوفان + 50 جرام مكسرات + 30 جرام فواكه مجففة" },
        { type: "الغداء", emoji: "🍚", content: "أرز بني + فاصوليا + خضار + أفوكادو", calories: 1200, quantityDetails: "250 جرام أرز مطبوخ + 200 جرام فاصوليا + 200 جرام خضار + 1 حبة أفوكادو" },
        { type: "العشاء", emoji: "🍲", content: "شوربة عدس كبيرة + خبز أسمر", calories: 500, quantityDetails: "400 مل شوربة + 60 جرام خبز" },
        { type: "سناك", emoji: "🍎", content: "تفاحة + زبدة فول سوداني + مكسرات", calories: 100, quantityDetails: "1 حبة تفاح + 10 جرام زبدة + 10 جرام مكسرات" }
      ],
      totalCalories: 2700
    },
    {
      id: 18,
      name: "خطة نباتية 2800 سعرة حرارية",
      emoji: "🥒",
      description: "مناسبة للرياضيين ذوي الاحتياج العالي.",
      calories: 2800,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "فول + طعمية + خبز كبير + سلطة", calories: 900, quantityDetails: "350 جرام فول + 7-8 حبات طعمية + 70 جرام خبز + سلطة" },
        { type: "الغداء", emoji: "🌯", content: "بوريتو نباتي عملاق", calories: 1300, quantityDetails: "1 بوريتو ضخم جداً" },
        { type: "العشاء", emoji: "🥔", content: "بطاطا حلوة كبيرة + سلطة كينوا", calories: 500, quantityDetails: "300 جرام بطاطا + 150 جرام سلطة كينوا" },
        { type: "سناك", emoji: "🍓", content: "فواكه مشكلة + زبادي نباتي", calories: 100, quantityDetails: "100 جرام فواكه + 50 جرام زبادي" }
      ],
      totalCalories: 2800
    },
    {
      id: 19,
      name: "خطة نباتية 2900 سعرة حرارية",
      emoji: "🥕",
      description: "تحمل وطاقة لا حدود لها.",
      calories: 2900,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "بان كيك بروتين نباتي كبير + مكسرات", calories: 900, quantityDetails: "5 بان كيك كبير + 50 جرام مكسرات" },
        { type: "الغداء", emoji: "🥗", content: "سلطة كينوا عملاقة + حمص + أفوكادو", calories: 1400, quantityDetails: "350 جرام كينوا مطبوخة + 250 جرام حمص + 1 حبة أفوكادو" },
        { type: "العشاء", emoji: "🍝", content: "باستا الخضار بصوص الكريمة النباتية", calories: 500, quantityDetails: "250 جرام باستا + خضار + صوص كريمة" },
        { type: "سناك", emoji: "🍌", content: "موزتين + زبدة فول سوداني + بذور الشيا", calories: 100, quantityDetails: "2 حبة موز + 20 جرام زبدة + 10 جرام بذور" }
      ],
      totalCalories: 2900
    },
    {
      id: 20,
      name: "خطة نباتية 3000 سعرة حرارية",
      emoji: "🥔",
      description: "أقصى طاقة وبناء عضلي.",
      calories: 3000,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بروتين كبير + توت + مكسرات + بذور", calories: 1000, quantityDetails: "100 جرام شوفان بروتين + 100 جرام توت + 50 جرام مكسرات + 20 جرام بذور" },
        { type: "الغداء", emoji: "🌯", content: "بوريتو نباتي بحجم إكسترا", calories: 1500, quantityDetails: "1 بوريتو إكسترا كبير" },
        { type: "العشاء", emoji: "🍠", content: "بطاطا حلوة ضخمة محشوة بالفاصوليا والكينوا", calories: 400, quantityDetails: "400 جرام بطاطا + حشوة" },
        { type: "سناك", emoji: "🍎", content: "تفاحة + زبدة لوز + مكسرات متنوعة", calories: 100, quantityDetails: "1 حبة تفاح + 15 جرام زبدة لوز + 15 جرام مكسرات" }
      ],
      totalCalories: 3000
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
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست", calories: 250, quantityDetails: "2 بيضة مسلوقة + 1 شريحة توست" },
        { type: "الغداء", emoji: "🍗", content: "صدر دجاج + رز", calories: 500, quantityDetails: "150 جرام صدر دجاج + 100 جرام أرز بعد الطهي" },
        { type: "العشاء", emoji: "🥙", content: "تونة + سلطة", calories: 350, quantityDetails: "1 علبة تونة بالماء + طبق سلطة كبير" },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100, quantityDetails: "1 حبة" }
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
        { type: "الإفطار", emoji: "🥚", content: "بيضتين + جبنة + خبز", calories: 300, quantityDetails: "2 بيضة مقلية + 50 جرام جبنة + 50 جرام خبز" },
        { type: "الغداء", emoji: "🥚", content: "لحم مشوي + أرز + سلطة", calories: 600, quantityDetails: "150 جرام لحم + 100 جرام أرز + طبق سلطة" },
        { type: "العشاء", emoji: "🥚", content: "ساندويتش دجاج + عصير", calories: 250, quantityDetails: "1 ساندويتش صغير + 200 مل عصير" },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 100, quantityDetails: "1 حبة" }
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
        { type: "الإفطار", emoji: "🥞", content: "بان كيك + عسل + حليب", calories: 350, quantityDetails: "2 بان كيك متوسط + 20 جرام عسل + 200 مل حليب" },
        { type: "الغداء", emoji: "🍔", content: "برجر دجاج + بطاطس + عصير", calories: 600, quantityDetails: "1 برجر دجاج متوسط + 100 جرام بطاطس + 200 مل عصير" },
        { type: "العشاء", emoji: "🍝", content: "مكرونة + دجاج + سلطة", calories: 250, quantityDetails: "100 جرام مكرونة + 50 جرام دجاج + سلطة" },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة + مكسرات", calories: 100, quantityDetails: "20 جرام شوكولاتة + 15 جرام مكسرات" }
      ],
      totalCalories: 1300
    },
    {
      id: 104,
      name: "خطة 1350 سعرة حرارية",
      emoji: "🍕",
      description: "مرنة ولذيذة.",
      calories: 1350,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + فواكه", calories: 300, quantityDetails: "50 جرام شوفان + 100 جرام فواكه" },
        { type: "الغداء", emoji: "🍕", content: "شريحة بيتزا دجاج + سلطة", calories: 600, quantityDetails: "1 شريحة بيتزا متوسطة + سلطة" },
        { type: "العشاء", emoji: "🍲", content: "شوربة عدس + خبز", calories: 350, quantityDetails: "300 مل شوربة + 50 جرام خبز" },
        { type: "سناك", emoji: "🍊", content: "برتقالة", calories: 100, quantityDetails: "1 حبة" }
      ],
      totalCalories: 1350
    },
    {
      id: 105,
      name: "خطة 1400 سعرة حرارية",
      emoji: "🍤",
      description: "غنية بالبروتين البحري.",
      calories: 1400,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيض + خضار", calories: 350, quantityDetails: "2 بيضة + 100 جرام خضار" },
        { type: "الغداء", emoji: "🍤", content: "جمبري مشوي + أرز", calories: 700, quantityDetails: "150 جرام جمبري + 100 جرام أرز" },
        { type: "العشاء", emoji: "🥗", content: "سلطة دجاج", calories: 250, quantityDetails: "150 جرام دجاج + سلطة" },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 100, quantityDetails: "1 حبة" }
      ],
      totalCalories: 1400
    },
    {
      id: 106,
      name: "خطة 1450 سعرة حرارية",
      emoji: "🥩",
      description: "لزيادة الوزن بشكل صحي.",
      calories: 1450,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + حليب + مكسرات", calories: 400, quantityDetails: "60 جرام شوفان + 200 مل حليب + 30 جرام مكسرات" },
        { type: "الغداء", emoji: "🥩", content: "لحم + أرز + خضار", calories: 700, quantityDetails: "150 جرام لحم + 100 جرام أرز + 100 جرام خضار" },
        { type: "العشاء", emoji: "🍗", content: "دجاج + بطاطس", calories: 250, quantityDetails: "100 جرام دجاج + 100 جرام بطاطس" },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة داكنة", calories: 100, quantityDetails: "25 جرام" }
      ],
      totalCalories: 1450
    },
    {
      id: 107,
      name: "خطة 1500 سعرة حرارية",
      emoji: "🍣",
      description: "متوازنة وغنية بالأوميجا 3.",
      calories: 1500,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيض + أفوكادو", calories: 400, quantityDetails: "2 بيضة + نصف حبة أفوكادو" },
        { type: "الغداء", emoji: "🍣", content: "سوشي + سلطة", calories: 700, quantityDetails: "8-10 قطع سوشي + سلطة" },
        { type: "العشاء", emoji: "🍲", content: "شوربة بحرية", calories: 300, quantityDetails: "300 مل" },
        { type: "سناك", emoji: "🍓", content: "فواكه", calories: 100, quantityDetails: "150 جرام" }
      ],
      totalCalories: 1500
    },
    {
      id: 108,
      name: "خطة 1550 سعرة حرارية",
      emoji: "🍔",
      description: "مناسبة لزيادة الوزن بشكل صحي.",
      calories: 1550,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك + عسل", calories: 400, quantityDetails: "3 بان كيك صغير + 30 جرام عسل" },
        { type: "الغداء", emoji: "🍔", content: "برجر لحم + بطاطس", calories: 800, quantityDetails: "1 برجر لحم متوسط + 150 جرام بطاطس" },
        { type: "العشاء", emoji: "🍝", content: "مكرونة بالدجاج", calories: 250, quantityDetails: "100 جرام مكرونة + 50 جرام دجاج" },
        { type: "سناك", emoji: "🥜", content: "مكسرات", calories: 100, quantityDetails: "30 جرام" }
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
        { type: "الإفطار", emoji: "🍳", content: "3 بيض + خبز + جبنة", calories: 500, quantityDetails: "3 بيض مقلي + 50 جرام خبز + 50 جرام جبنة" },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + بطاطس + سلطة", calories: 800, quantityDetails: "180 جرام لحم + 150 جرام بطاطس + سلطة" },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 200, quantityDetails: "1 ساندويتش صغير + 150 مل عصير" },
        { type: "سناك", emoji: "🍏", content: "تفاحة + مكسرات", calories: 100, quantityDetails: "1 حبة تفاح + 15 جرام مكسرات" }
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
        { type: "الإفطار", emoji: "🍳", content: "4 بيض + خبز + جبنة", calories: 600, quantityDetails: "4 بيض مقلي + 60 جرام خبز + 60 جرام جبنة" },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 800, quantityDetails: "180 جرام لحم + 100 جرام أرز + سلطة" },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 150, quantityDetails: "1 ساندويتش صغير" },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100, quantityDetails: "1 حبة" }
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
        { type: "الإفطار", emoji: "🍳", content: "بيضتين + توست", calories: 400, quantityDetails: "2 بيضة مسلوقة + 2 شريحة توست" },
        { type: "الغداء", emoji: "🍗", content: "صدر دجاج + رز + سلطة", calories: 900, quantityDetails: "200 جرام صدر دجاج + 150 جرام أرز + سلطة" },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج + عصير", calories: 200, quantityDetails: "1 ساندويتش صغير + 150 مل عصير" },
        { type: "سناك", emoji: "🍏", content: "تفاحة", calories: 100, quantityDetails: "1 حبة" }
      ],
      totalCalories: 1700
    },
    {
      id: 112,
      name: "خطة 1750 سعرة حرارية",
      emoji: "🍖",
      description: "مناسبة لزيادة الوزن بشكل صحي.",
      calories: 1750,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك + عسل + حليب", calories: 500, quantityDetails: "3 بان كيك متوسط + 30 جرام عسل + 250 مل حليب" },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + بطاطس + سلطة", calories: 900, quantityDetails: "200 جرام لحم + 200 جرام بطاطس + سلطة" },
        { type: "العشاء", emoji: "🍔", content: "برجر دجاج + عصير", calories: 250, quantityDetails: "1 برجر دجاج صغير + 200 مل عصير" },
        { type: "سناك", emoji: "🍌", content: "موزة", calories: 100, quantityDetails: "1 حبة" }
      ],
      totalCalories: 1750
    },
    {
      id: 113,
      name: "خطة 1800 سعرة حرارية",
      emoji: "🍔",
      description: "متوازنة للرياضيين.",
      calories: 1800,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "3 بيض + خبز + جبنة", calories: 500, quantityDetails: "3 بيض مقلي + 60 جرام خبز + 60 جرام جبنة" },
        { type: "الغداء", emoji: "🍔", content: "برجر لحم كبير + بطاطس", calories: 900, quantityDetails: "1 برجر لحم كبير + 150 جرام بطاطس" },
        { type: "العشاء", emoji: "🍝", content: "مكرونة بالدجاج + سلطة", calories: 300, quantityDetails: "150 جرام مكرونة + 100 جرام دجاج + سلطة" },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة + مكسرات", calories: 100, quantityDetails: "20 جرام شوكولاتة + 15 جرام مكسرات" }
      ],
      totalCalories: 1800
    },
    {
      id: 114,
      name: "خطة 1850 سعرة حرارية",
      emoji: "🍤",
      description: "غنية بالبروتين والدهون الصحية.",
      calories: 1850,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيض + أفوكادو + توست", calories: 600, quantityDetails: "3 بيض + 1 حبة أفوكادو + 2 شريحة توست" },
        { type: "الغداء", emoji: "🍤", content: "جمبري مشوي + أرز + خضار", calories: 900, quantityDetails: "200 جرام جمبري + 150 جرام أرز + 100 جرام خضار" },
        { type: "العشاء", emoji: "🥗", content: "سلطة تونة كبيرة", calories: 250, quantityDetails: "200 جرام تونة + سلطة" },
        { type: "سناك", emoji: "🍓", content: "فواكه مشكلة", calories: 100, quantityDetails: "150 جرام" }
      ],
      totalCalories: 1850
    },
    {
      id: 115,
      name: "خطة 1900 سعرة حرارية",
      emoji: "🍣",
      description: "متنوعة ولذيذة.",
      calories: 1900,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بالحليب كامل الدسم + مكسرات", calories: 500, quantityDetails: "60 جرام شوفان + 250 مل حليب + 40 جرام مكسرات" },
        { type: "الغداء", emoji: "🍣", content: "سوشي متنوع كبير + سلطة", calories: 900, quantityDetails: "12-15 قطعة سوشي + سلطة كبيرة" },
        { type: "العشاء", emoji: "🍲", content: "شوربة بحرية كبيرة", calories: 400, quantityDetails: "350 مل" },
        { type: "سناك", emoji: "🍊", content: "برتقالة + مكسرات", calories: 100, quantityDetails: "1 حبة برتقال + 15 جرام مكسرات" }
      ],
      totalCalories: 1900
    },
    {
      id: 116,
      name: "خطة 2000 سعرة حرارية",
      emoji: "🍕",
      description: "مرنة ومناسبة للحياة اليومية.",
      calories: 2000,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيض + بيكون + خبز", calories: 600, quantityDetails: "3 بيض مقلي + 50 جرام بيكون + 60 جرام خبز" },
        { type: "الغداء", emoji: "🍕", content: "شريحتين بيتزا دجاج + سلطة", calories: 900, quantityDetails: "2 شريحة بيتزا متوسطة + سلطة" },
        { type: "العشاء", emoji: "🍗", content: "دجاج مشوي + خضار", calories: 400, quantityDetails: "150 جرام دجاج + 150 جرام خضار" },
        { type: "سناك", emoji: "��", content: "موزة + زبدة فول سوداني", calories: 100, quantityDetails: "1 حبة موز + 15 جرام زبدة فول سوداني" }
      ],
      totalCalories: 2000
    },
    {
      id: 117,
      name: "خطة 2100 سعرة حرارية",
      emoji: "🍗",
      description: "غنية بالبروتين لبناء العضلات.",
      calories: 2100,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "4 بيض + خبز + جبنة", calories: 700, quantityDetails: "4 بيض مقلي + 70 جرام خبز + 70 جرام جبنة" },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي + أرز + سلطة", calories: 1000, quantityDetails: "200 جرام لحم + 150 جرام أرز + سلطة" },
        { type: "العشاء", emoji: "🥪", content: "ساندويتش دجاج كبير + عصير", calories: 300, quantityDetails: "1 ساندويتش كبير + 250 مل عصير" },
        { type: "سناك", emoji: "🍏", content: "تفاحة + مكسرات", calories: 100, quantityDetails: "1 حبة تفاح + 15 جرام مكسرات" }
      ],
      totalCalories: 2100
    },
    {
      id: 118,
      name: "خطة 2200 سعرة حرارية",
      emoji: "🍖",
      description: "لزيادة الوزن بشكل صحي.",
      calories: 2200,
      meals: [
        { type: "الإفطار", emoji: "🥞", content: "بان كيك كبير + عسل + حليب", calories: 700, quantityDetails: "4 بان كيك كبير + 40 جرام عسل + 300 مل حليب" },
        { type: "الغداء", emoji: "🍖", content: "لحم مشوي كبير + بطاطس + سلطة", calories: 1100, quantityDetails: "250 جرام لحم + 200 جرام بطاطس + سلطة" },
        { type: "العشاء", emoji: "🍔", content: "برجر دجاج كبير + عصير", calories: 300, quantityDetails: "1 برجر دجاج كبير + 250 مل عصير" },
        { type: "سناك", emoji: "🍌", content: "موزة + زبدة لوز", calories: 100, quantityDetails: "1 حبة موز + 15 جرام زبدة لوز" }
      ],
      totalCalories: 2200
    },
    {
      id: 119,
      name: "خطة 2300 سعرة حرارية",
      emoji: "🍔",
      description: "طاقة عالية للرياضيين.",
      calories: 2300,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "3 بيض + بيكون + خبز", calories: 800, quantityDetails: "3 بيض مقلي + 60 جرام بيكون + 70 جرام خبز" },
        { type: "الغداء", emoji: "🍣", content: "برجر لحم عملاق + بطاطس", calories: 1200, quantityDetails: "1 برجر لحم عملاق + 200 جرام بطاطس" },
        { type: "العشاء", emoji: "🍝", content: "مكرونة باللحم + سلطة", calories: 200, quantityDetails: "100 جرام مكرونة + 50 جرام لحم + سلطة" },
        { type: "سناك", emoji: "🍫", content: "شوكولاتة + مكسرات متنوعة", calories: 100, quantityDetails: "20 جرام شوكولاتة + 20 جرام مكسرات" }
      ],
      totalCalories: 2300
    },
    {
      id: 120,
      name: "خطة 2400 سعرة حرارية",
      emoji: "🍤",
      description: "غنية بالبروتين البحري والدهون الصحية.",
      calories: 2400,
      meals: [
        { type: "الإفطار", emoji: "🥚", content: "بيض + أفوكادو + توست كبير", calories: 700, quantityDetails: "4 بيض + 1 حبة أفوكادو + 2 شريحة توست كبير" },
        { type: "الغداء", emoji: "🍤", content: "جمبري مشوي كبير + أرز + خضار", calories: 1300, quantityDetails: "250 جرام جمبري + 200 جرام أرز + 150 جرام خضار" },
        { type: "العشاء", emoji: "🥗", content: "سلطة تونة عملاقة", calories: 300, quantityDetails: "250 جرام تونة + سلطة" },
        { type: "سناك", emoji: "🍓", content: "فواكه مشكلة + زبادي", calories: 100, quantityDetails: "100 جرام فواكه + 50 جرام زبادي" }
      ],
      totalCalories: 2400
    },
    {
      id: 121,
      name: "خطة 2500 سعرة حرارية",
      emoji: "🍣",
      description: "متنوعة ومغذية.",
      calories: 2500,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان بالحليب كامل الدسم + مكسرات وفواكه", calories: 600, quantityDetails: "70 جرام شوفان + 300 مل حليب + 40 جرام مكسرات + 60 جرام فواكه" },
        { type: "الغداء", emoji: "🍣", content: "سوشي متنوع كبير + سلطة", calories: 1200, quantityDetails: "15-20 قطعة سوشي + سلطة كبيرة" },
        { type: "العشاء", emoji: "🍲", content: "شوربة بحرية كبيرة + خبز", calories: 600, quantityDetails: "400 مل شوربة + 80 جرام خبز" },
        { type: "سناك", emoji: "🍊", content: "برتقالة + مكسرات + بذور", calories: 100, quantityDetails: "1 حبة برتقال + 15 جرام مكسرات + 10 جرام بذور" }
      ],
      totalCalories: 2500
    }
  ];

  const plansToShow = activeTab === 'vegetarian' ? vegetarianPlans : nonVegetarianPlans;

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'vegetarian' ? styles.active : ''}`}
          onClick={() => setActiveTab('vegetarian')}
        >
          نباتي
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'nonVegetarian' ? styles.active : ''}`}
          onClick={() => setActiveTab('nonVegetarian')}
        >
          غير نباتي
        </button>
      </div>

      <div className={styles.plansGrid}>
        {plansToShow.map((plan) => (
          <div key={plan.id} className={styles.planCard}>
            <div className={styles.planEmoji}>{plan.emoji}</div>
            <h3 className={styles.planName}>{plan.name}</h3>
            <p className={styles.planDescription}>{plan.description}</p>
            <div className={styles.planCalories}>{plan.calories} سعرة حرارية</div>
            <button
              className={styles.viewButton}
              onClick={() => handleViewPlan(plan)}
            >
              عرض
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedPlan && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <h2 className={styles.modalTitle}>{selectedPlan.name}</h2>
            <div className={styles.mealsList}>
              {selectedPlan.meals.map((meal, index) => (
                <div key={index} className={styles.mealItem}>
                  <div className={styles.mealHeader}>
                    <span className={styles.mealEmoji}>{meal.emoji}</span>
                    <span className={styles.mealType}>{meal.type}</span>
                  </div>
                  <div className={styles.mealDetails}>
                    <p className={styles.mealContent}>
                      {meal.content} {meal.quantityDetails && <span className={styles.quantityDetails}>({meal.quantityDetails})</span>}
                    </p>
                    <div className={styles.mealCalories}>{meal.calories} سعرة حرارية</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.totalCalories}>
              إجمالي السعرات: {selectedPlan.totalCalories} سعرة حرارية
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutritionPlan; 