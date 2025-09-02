const form = document.getElementById('signupForm');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          name,
          email,
          password
        });
        message.style.color = 'lime';
        message.textContent = 'Signup successful! You can now log in.';

        setTimeout(()=>{
          window.location.href="login.html"
        },1000)
      } catch (error) {
        message.style.color = 'red';
        message.textContent = error.response?.data?.message || 'Something went wrong!';
        setTimeout(()=>{
          window.location.href="signup.html"
        },1000)
        
      }
    });
