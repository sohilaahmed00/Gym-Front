import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CoachProfile.module.css';

const CoachProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [message, setMessage] = useState('');
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);

  // Sample coaches data - in a real app, this would come from an API
  const coaches = [
    {
      id: 1,
      name: "Ahmed Said",
      specialization: "Fitness Trainer",
      bio: "Certified fitness trainer with 5 years of experience in personal training. Specialized in strength and endurance training.",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Dubai",
      experience: "5 years",
      certifications: [
        "NASM Certified Personal Trainer",
        "ACE Fitness Nutrition Specialist",
        "CrossFit Level 1 Trainer"
      ],
      specialties: [
        "Weight Loss",
        "Muscle Gain",
        "Strength Training",
        "Bodybuilding",
        "Nutrition Planning"
      ],
      availability: [
        "Monday: 9AM - 5PM",
        "Wednesday: 9AM - 5PM",
        "Friday: 9AM - 5PM"
      ],
      hourlyRate: "$50/hour",
      reviews: [
        {
          client: "John Smith",
          rating: 5,
          comment: "Amazing trainer! Helped me lose 20kg in 3 months."
        },
        {
          client: "Sarah Johnson",
          rating: 4,
          comment: "Very professional and knowledgeable. Great results!"
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Mohamed",
      specialization: "Nutrition Coach",
      bio: "Certified nutritionist with 3 years of experience in meal planning and client coaching.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      language: "Arabic",
      location: "Abu Dhabi",
      experience: "3 years",
      certifications: [
        "Precision Nutrition Level 1",
        "Sports Nutrition Specialist",
        "Dietetics Certification"
      ],
      specialties: [
        "Meal Planning",
        "Weight Management",
        "Sports Nutrition",
        "Dietary Counseling"
      ],
      availability: [
        "Tuesday: 10AM - 6PM",
        "Thursday: 10AM - 6PM",
        "Saturday: 9AM - 3PM"
      ],
      hourlyRate: "$45/hour",
      reviews: [
        {
          client: "Mohamed Ali",
          rating: 5,
          comment: "Excellent nutritionist! Helped me improve my diet and energy levels."
        },
        {
          client: "Fatima Ahmed",
          rating: 4,
          comment: "Very knowledgeable and supportive. Great meal plans!"
        }
      ]
    },
    {
      id: 3,
      name: "Mohamed Ali",
      specialization: "Sports Coach",
      bio: "Professional sports coach with 7 years of experience in team sports and professional athletes training.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Dubai",
      experience: "7 years",
      certifications: [
        "NSCA Certified Strength Coach",
        "Sports Performance Specialist",
        "Athletic Training Certification"
      ],
      specialties: [
        "Team Sports",
        "Athletic Performance",
        "Speed Training",
        "Agility Training"
      ],
      availability: [
        "Monday: 8AM - 4PM",
        "Wednesday: 8AM - 4PM",
        "Friday: 8AM - 4PM"
      ],
      hourlyRate: "$60/hour",
      reviews: [
        {
          client: "Ahmed Hassan",
          rating: 5,
          comment: "Best sports coach I've ever worked with! Improved my performance significantly."
        },
        {
          client: "Youssef Mohamed",
          rating: 4,
          comment: "Professional and dedicated. Great training programs!"
        }
      ]
    },
    {
      id: 4,
      name: "Layla Ahmed",
      specialization: "Fitness Trainer",
      bio: "Certified fitness trainer specialized in women's training with 4 years of experience in fitness.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Abu Dhabi",
      experience: "4 years",
      certifications: [
        "NASM Certified Personal Trainer",
        "Women's Fitness Specialist",
        "Prenatal and Postnatal Exercise Specialist"
      ],
      specialties: [
        "Women's Fitness",
        "Prenatal Training",
        "Postnatal Recovery",
        "Body Toning"
      ],
      availability: [
        "Monday: 10AM - 6PM",
        "Wednesday: 10AM - 6PM",
        "Friday: 10AM - 6PM"
      ],
      hourlyRate: "$55/hour",
      reviews: [
        {
          client: "Fatima Hassan",
          rating: 5,
          comment: "Amazing trainer! Helped me get back in shape after pregnancy."
        },
        {
          client: "Nora Ali",
          rating: 5,
          comment: "Very supportive and knowledgeable about women's fitness."
        }
      ]
    },
    {
      id: 5,
      name: "John Smith",
      specialization: "Sports Coach",
      bio: "International sports coach with 10 years of experience in elite athlete training.",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "English",
      location: "Dubai",
      experience: "10 years",
      certifications: [
        "International Sports Science Association",
        "Elite Performance Coach",
        "Sports Psychology Specialist"
      ],
      specialties: [
        "Elite Athlete Training",
        "Performance Enhancement",
        "Sports Psychology",
        "Competition Preparation"
      ],
      availability: [
        "Tuesday: 8AM - 4PM",
        "Thursday: 8AM - 4PM",
        "Saturday: 8AM - 2PM"
      ],
      hourlyRate: "$70/hour",
      reviews: [
        {
          client: "David Wilson",
          rating: 5,
          comment: "World-class coach! Took my performance to the next level."
        },
        {
          client: "Michael Brown",
          rating: 4,
          comment: "Excellent technical knowledge and training methods."
        }
      ]
    },
    {
      id: 6,
      name: "Nora Khalid",
      specialization: "Nutrition Coach",
      bio: "Certified nutritionist specialized in sports nutrition with 6 years of experience.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      language: "Arabic",
      location: "Abu Dhabi",
      experience: "6 years",
      certifications: [
        "Sports Nutrition Specialist",
        "Performance Nutrition Coach",
        "Dietetics Certification"
      ],
      specialties: [
        "Sports Nutrition",
        "Performance Diet",
        "Weight Management",
        "Supplementation"
      ],
      availability: [
        "Monday: 9AM - 5PM",
        "Wednesday: 9AM - 5PM",
        "Friday: 9AM - 5PM"
      ],
      hourlyRate: "$50/hour",
      reviews: [
        {
          client: "Ahmed Mohamed",
          rating: 5,
          comment: "Excellent sports nutritionist! Improved my performance significantly."
        },
        {
          client: "Youssef Ali",
          rating: 4,
          comment: "Very knowledgeable about sports nutrition and supplements."
        }
      ]
    },
    {
      id: 7,
      name: "Ali Hassan",
      specialization: "Fitness Trainer",
      bio: "Certified fitness trainer specialized in senior training with 8 years of experience.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Dubai",
      experience: "8 years",
      certifications: [
        "Senior Fitness Specialist",
        "Corrective Exercise Specialist",
        "Functional Training Expert"
      ],
      specialties: [
        "Senior Fitness",
        "Mobility Training",
        "Balance Improvement",
        "Joint Health"
      ],
      availability: [
        "Tuesday: 9AM - 5PM",
        "Thursday: 9AM - 5PM",
        "Saturday: 9AM - 3PM"
      ],
      hourlyRate: "$45/hour",
      reviews: [
        {
          client: "Omar Ahmed",
          rating: 5,
          comment: "Great trainer for seniors! Helped me improve my mobility and strength."
        },
        {
          client: "Fatima Hassan",
          rating: 4,
          comment: "Very patient and knowledgeable about senior fitness."
        }
      ]
    },
    {
      id: 8,
      name: "Emily Wilson",
      specialization: "Nutrition Coach",
      bio: "Certified nutritionist specialized in therapeutic nutrition with 5 years of experience.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      language: "English",
      location: "Abu Dhabi",
      experience: "5 years",
      certifications: [
        "Therapeutic Nutrition Specialist",
        "Clinical Nutritionist",
        "Dietetics Certification"
      ],
      specialties: [
        "Therapeutic Nutrition",
        "Medical Diet Planning",
        "Health Condition Management",
        "Weight Management"
      ],
      availability: [
        "Monday: 10AM - 6PM",
        "Wednesday: 10AM - 6PM",
        "Friday: 10AM - 6PM"
      ],
      hourlyRate: "$60/hour",
      reviews: [
        {
          client: "Sarah Johnson",
          rating: 5,
          comment: "Excellent therapeutic nutritionist! Helped me manage my health condition."
        },
        {
          client: "Michael Brown",
          rating: 4,
          comment: "Very knowledgeable about medical nutrition therapy."
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCoach = async () => {
      try {
        // In a real app, this would be an API call
        const foundCoach = coaches.find(c => c.id === parseInt(id));
        setCoach(foundCoach);
        if (foundCoach) {
          setReviews(foundCoach.reviews);
        }
      } catch (error) {
        console.error('Error fetching coach:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  const handleBooking = () => {
    if (!bookingDate || !bookingTime) {
      alert('Please select both date and time');
      return;
    }
    // In a real app, this would send data to a backend
    console.log('Booking session:', {
      coachId: id,
      date: bookingDate,
      time: bookingTime
    });
    alert('Session booked successfully!');
    setShowBookingModal(false);
    setBookingDate('');
    setBookingTime('');
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }
    // In a real app, this would send data to a backend
    console.log('Sending message:', {
      coachId: id,
      message: message
    });
    alert('Message sent successfully!');
    setShowMessageModal(false);
    setMessage('');
  };

  const handleAddReview = () => {
    if (!newReview.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    const review = {
      client: 'Current User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    };

    // Update reviews
    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);

    // Update coach's average rating
    const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / updatedReviews.length;
    
    setCoach({
      ...coach,
      rating: parseFloat(averageRating.toFixed(1))
    });

    setShowReviewModal(false);
    setNewReview({ rating: 5, comment: '' });
  };

  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${styles.star} ${i < rating ? styles.selected : ''}`}
        onClick={isInteractive ? () => setNewReview({ ...newReview, rating: i + 1 }) : undefined}
        style={{ color: i < rating ? '#FFD700' : '#ddd' }}
      />
    ));
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!coach) {
    return <div className={styles.notFound}>Coach not found</div>;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.heroSection}>
        <div className={styles.heroImage}>
          <img src={coach.image} alt={coach.name} />
        </div>
        <div className={styles.heroContent}>
          <h1>{coach.name}</h1>
          <div className={styles.specialization}>{coach.specialization}</div>
          <div className={styles.location}>
            <i className="fas fa-map-marker-alt" />
            <span>{coach.location}</span>
          </div>
          <div className={styles.language}>
            <i className="fas fa-globe" />
            <span>{coach.language}</span>
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.mainContent}>
          <div className={styles.aboutSection}>
            <h2>About</h2>
            <p>{coach.bio}</p>
          </div>

          <div className={styles.specialtiesSection}>
            <h2>Specialties</h2>
            <div className={styles.specialtiesGrid}>
              {coach.specialties.map((specialty, index) => (
                <div key={index} className={styles.specialtyCard}>
                  <i className="fas fa-check" />
                  <span>{specialty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.certificationsSection}>
            <h2>Certifications</h2>
            <ul>
              {coach.certifications.map((cert, index) => (
                <li key={index}>
                  <i className="fas fa-certificate" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.availabilitySection}>
            <h2>Availability</h2>
            <div className={styles.availabilityGrid}>
              {coach.availability.map((slot, index) => (
                <div key={index} className={styles.availabilitySlot}>
                  {slot}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.reviewsSection}>
            <h2>
              Client Reviews
              <button className={styles.addReviewButton} onClick={() => setShowReviewModal(true)}>
                <i className="fas fa-plus" />
                Add Review
              </button>
            </h2>
            <div className={styles.reviewsGrid}>
              {reviews.map((review, index) => (
                <div key={index} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <h3>{review.client}</h3>
                    <div className={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                  <div className={styles.reviewDate}>{review.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <h3>Book a Session</h3>
            <div className={styles.rate}>{coach.hourlyRate}</div>
            <div className={styles.experience}>{coach.experience} experience</div>
            <button className={styles.bookButton} onClick={() => setShowBookingModal(true)}>
              <i className="fas fa-calendar-check" />
              Book Now
            </button>
          </div>

          <div className={styles.contactCard}>
            <h3>Contact Coach</h3>
            <button className={styles.messageButton} onClick={() => setShowMessageModal(true)}>
              <i className="fas fa-envelope" />
              Send Message
            </button>
            <button className={styles.callButton}>
              <i className="fas fa-phone" />
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Book a Session</h2>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className={styles.input}
            />
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className={styles.input}
            />
            <div className={styles.modalButtons}>
              <button onClick={handleBooking} className={styles.confirmButton}>
                Confirm Booking
              </button>
              <button onClick={() => setShowBookingModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Send Message</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.textarea}
              placeholder="Type your message here..."
            />
            <div className={styles.modalButtons}>
              <button onClick={handleSendMessage} className={styles.confirmButton}>
                Send Message
              </button>
              <button onClick={() => setShowMessageModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Your Review</h2>
            <div className={styles.ratingInput}>
              <span>Rating: </span>
              {renderStars(newReview.rating, true)}
              <span className={styles.ratingValue}>{newReview.rating} stars</span>
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className={styles.textarea}
              placeholder="Share your experience with this coach..."
            />
            <div className={styles.modalButtons}>
              <button onClick={handleAddReview} className={styles.confirmButton}>
                Submit Review
              </button>
              <button onClick={() => setShowReviewModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachProfile;