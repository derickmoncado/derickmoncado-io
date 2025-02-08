"use strict";

(() => {
	console.log("document ready!");

	// Appends the 'active' class to nav links
	let pathname = "." + window.location.pathname;
	document
		.querySelectorAll(`.navbar-nav > li > a[href='${pathname}']`)
		.forEach((el) => {
			el.classList.add("active");
		});

	// add class to header on scroll to add drop shadow
	const headerBar = document.getElementById("dm-header");
	window.onscroll = () => {
		if (window.scrollY > 40) {
			headerBar.classList.add("active");
		} else {
			headerBar.classList.remove("active");
		}
	};

	// add class to the header when nav is open
	const navBtn = document.querySelector(".navbar-toggler");
	navBtn.addEventListener("click", () => {
		headerBar.classList.toggle("open");
	});

	// then close nav when a nav-link is clicked
	const navLink = document.querySelectorAll(".nav-link");
	navLink.forEach((link) => {
		link.addEventListener("click", () => {
			if (window.innerWidth < 992) {
				navBtn.click();
			}
		});
	});

	// =============================
	// Init Swiper (swiper.js)
	const swiper = new Swiper(".swiper", {
		loop: true,
		autoHeight: true,
		pagination: {
			el: ".swiper-pagination"
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev"
		},
		scrollbar: {
			el: ".swiper-scrollbar"
		}
	});

	// =============================
	// Init Emergence (emergence.js)
	emergence.init({
		elemCushion: 0.75, // toggles class when element is 75% visible
		reset: false
	});

	// =============================
	// Init tooltips everywhere (popper.js)
	var popoverTriggerList = [].slice.call(
		document.querySelectorAll('[data-bs-toggle="popover"]')
	);
	var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl);
	});

	// =============================
	/* Assign subpage a unique ID */
	// Get the current page's filename (assuming your pages are in the same directory)
	var currentPage = window.location.pathname.split("/").pop().split(".")[0];

	// Assign the current page's filename as the HTML ID
	document.documentElement.id = currentPage;

	// =============================
	/* Fetch GitHub Gists and display on page */
	const username = "derickmoncado";
	const snippetsContainer = document.querySelector(".snippet-list");
	let snippets = [];

	const fetchSnippets = async () => {
		try {
			const uri = `https://api.github.com/users/${username}/gists`;
			const res = await fetch(uri);
			const data = await res.json();
			snippets = data;
		} catch (error) {
			console.log(error);
		}

		// Let's see'em!
		console.log(snippets);

		// Extract a couple values and then build out our HTML
		let template = "";
		snippets.forEach((snippet) => {
			let snippetFilename;
			let snippetDesc = snippet.description;
			let snippetId = snippet.id;

			// Access the files object of each object
			const filesObject = snippet.files;

			// Iterate over the keys in the files object and get/assign the filename value
			Object.keys(filesObject).forEach((key) => {
				snippetFilename = filesObject[key].filename;

				// Add space and remove ".js" extension from filename
				snippetFilename = snippetFilename.replace(").js", " )");
			});

			template += `
            <li class="snippet">
                <div class="snippet__description">
                    <h4>${snippetFilename}</h4>
                    <p>${snippetDesc}</p>
                </div>
                <div class="snippet__code">
                    <iframe src="https://gist.github.com/derickmoncado/${snippetId}.pibb"></iframe>
                </div>
            </li>
        `;
		});

		snippetsContainer.innerHTML = template;
	};

	//fetchSnippets();

	// =============================
	// Fetch and display Youtube data
	const API_KEY = "AIzaSyCLtOJRx0fbTBdyDZz1Xs5oeZcsBKxkUA8"; // API key
	const CHANNEL_ID = "UC_DJjEMnbmiFHfQS5oxZ1Ug"; // YouTube channel ID

	const fetchLatestVideo = async () => {
		console.log("Fetching latest video...");
		try {
			const channelRes = await fetch(
				`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
			);
			const channelData = await channelRes.json();
			const uploadsPlaylistId =
				channelData?.items?.[0]?.contentDetails?.relatedPlaylists
					?.uploads;

			if (!uploadsPlaylistId)
				throw new Error("Could not retrieve uploads playlist.");

			const videoRes = await fetch(
				`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${API_KEY}`
			);
			const videoData = await videoRes.json();
			const video = videoData?.items?.[0]?.snippet;

			if (!video) throw new Error("No video found.");

			document.querySelector("#video-container").innerHTML = `
                <h3>${video.title}</h3>
                <iframe src="https://www.youtube.com/embed/${video.resourceId.videoId}" frameborder="0" allowfullscreen></iframe>
            `;
		} catch (error) {
			console.error("Error fetching latest video:", error);
		}
	};

	// const fetchSubscriberCount = async () => {
	// 	console.log("Fetching subscriber count...");
	// 	try {
	// 		const res = await fetch(
	// 			`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
	// 		);
	// 		const data = await res.json();
	// 		const subscriberCount =
	// 			data?.items?.[0]?.statistics?.subscriberCount;

	// 		document.querySelector(
	// 			"#subscriber-count"
	// 		).textContent = `Subscribers: ${subscriberCount ?? "N/A"}`;
	// 	} catch (error) {
	// 		console.error("Error fetching subscriber count:", error);
	// 	}
	// };

	const loadYouTubeSubscribeButton = () => {
		const subscribeButtonDiv = document.querySelector("#subscribe-button");

		// Insert the subscribe button div
		subscribeButtonDiv.innerHTML = `
			<div class="g-ytsubscribe" 
				data-channelid="${CHANNEL_ID}" 
				data-layout="default" 
				data-count="default" 
				data-theme="dark">
			</div>
		`;

		// Remove any existing script to prevent duplicate loading
		const existingScript = document.querySelector(
			"script[src='https://apis.google.com/js/platform.js']"
		);
		if (existingScript) existingScript.remove();

		// Create and insert a new script tag
		const script = document.createElement("script");
		script.src = "https://apis.google.com/js/platform.js";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
	};

	// Fetch data when the page loads
	fetchLatestVideo();
	//fetchSubscriberCount();
	loadYouTubeSubscribeButton();
})();
