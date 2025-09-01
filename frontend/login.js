async function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const message = document.getElementById('message');

      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        message.textContent = "Login successful!";
        message.style.color = "lightgreen";
        localStorage.setItem('token', res.data.token)
        window.location.href="dashboard.html";
        // Redirect if needed
      } catch (err) {
        message.textContent = err.response?.data?.message || "Login failed!";
        message.style.color = "red";
      }
    }