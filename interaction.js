// interaction.js 파일 통합 및 수정

document.addEventListener("DOMContentLoaded", function() {

    // ==========================================================
    // 1. 섹션 등장 효과 로직 (.animate-item)
    // ==========================================================
    const animateItems = document.querySelectorAll('.animate-item');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    animateItems.forEach(item => {
        observer.observe(item);
    });

    // ==========================================================
    // 1-2. 새로운 섹션 등장 효과 로직 (.animate-item-2 -> is-visible-2)
    // ==========================================================
    const animateItems2 = document.querySelectorAll('.animate-item-2'); // ✨ 새로운 대상 클래스
    // 옵션은 같거나 다르게 설정할 수 있습니다. (여기서는 동일하게 사용)
    
    const observerCallback2 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible-2'); // ✨ 새로운 애니메이션 클래스
                observer.unobserve(entry.target); 
            }
        });
    };
    const observer2 = new IntersectionObserver(observerCallback2, observerOptions);
    animateItems2.forEach(item => {
        observer2.observe(item);
    });

    // ==========================================================
    // 2. 여섯 번째 섹션: Sticky Scroll 이미지 교체 로직 (#section-solution)
    // ==========================================================
    const solutionSection = document.getElementById('section-solution');
    const stickyWrapper = document.getElementById('solution-sticky-wrapper');
    const img1 = document.getElementById('img-1');
    const img2 = document.getElementById('img-2');
    const img3 = document.getElementById('img-3');
    const container1 = img1 ? img1.parentElement : null;
    const container2 = img2 ? img2.parentElement : null;
    const container3 = img3 ? img3.parentElement : null;

    if (stickyWrapper && solutionSection && img1) { 
        // ... (이미지 및 마진 데이터 정의, updateImages 함수, handleScroll 함수는 그대로 유지) ...
        // (이 부분은 파일에 이미 있으니 생략하고, window.addEventListener('scroll', handleScroll)만 남깁니다.)

        // 스크롤 이벤트 핸들러 (Sticky Scroll 로직) - 이전에 보낸 코드와 동일
        const imageGroups = [
            // 그룹 1: solution1, solution2, solution3
            { sources: ['./img/solution/solution1.png', './img/solution/solution2.png', './img/solution/solution3.png'], marginClass: 'margin-group-1' },
            // 그룹 2: solution4, solution5, solution6
            { sources: ['./img/solution/solution4.png', './img/solution/solution5.png', './img/solution/solution6.png'], marginClass: 'margin-group-2' },
            // 그룹 3: solution7, solution8, solution9
            { sources: ['./img/solution/solution7.png', './img/solution/solution8.png', './img/solution/solution9.png'], marginClass: 'margin-group-3' }
        ];
        let currentGroupIndex = 0; 
        function updateImages(groupIndex) {
            // ... (updateImages 함수 내용 그대로) ...
            if (!img1 || !img2 || !img3) return;
            const group = imageGroups[groupIndex];
            const images = [img1, img2, img3];
            images[0].src = group.sources[0];
            images[1].src = group.sources[1];
            images[2].src = group.sources[2];
            const allMarginClasses = ['margin-group-1', 'margin-group-2', 'margin-group-3'];
            [container1, container2, container3].forEach(container => {
                if (container) {
                    container.classList.remove(...allMarginClasses); 
                    container.classList.add(group.marginClass);
                }
            });
            currentGroupIndex = groupIndex;
        }
        updateImages(0);
        const handleScroll = () => {
            const rect = stickyWrapper.getBoundingClientRect();
            const scrollProgress = -rect.top;
            const interactionHeight = stickyWrapper.offsetHeight - window.innerHeight;
            const progressRatio = Math.min(1, Math.max(0, scrollProgress / interactionHeight));
            let newGroupIndex;
            if (progressRatio < 0.33) {
                newGroupIndex = 0;
            } else if (progressRatio < 0.66) {
                newGroupIndex = 1;
            } else {
                newGroupIndex = 2;
            }
            if (newGroupIndex !== currentGroupIndex) {
                updateImages(newGroupIndex);
            }
        };
        window.addEventListener('scroll', handleScroll);
    }
    
    // ==========================================================
    // 3. 아홉 번째 섹션: Fade In 로직 (#logo-image-stack)
    // ==========================================================

    const newFadeImage = document.getElementById('new-fade-image');
    const detectionTarget = document.getElementById('logo-image-stack'); 

    if (newFadeImage && detectionTarget) {
        // **누락된 fadeOptions 정의**
        const fadeOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.5 
        };

        const fadeObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                // **감지 대상을 부모 컨테이너로 설정**하고, isIntersecting 시 클래스 추가
                if (entry.target === detectionTarget && entry.isIntersecting) { 
                    newFadeImage.classList.add('is-faded-in');
                    observer.unobserve(detectionTarget); 
                }
            });
        };

        const fadeObserver = new IntersectionObserver(fadeObserverCallback, fadeOptions);
        fadeObserver.observe(detectionTarget);
    }

    // ==========================================================
    // 4. 열한 번째 섹션: ON/OFF 배경 이미지 토글 로직
    // ==========================================================

    const onOffButton = document.getElementById('on-off-button');
    const mapRuteLayer = document.getElementById('map-route-layer'); 
    const buttonText = onOffButton ? onOffButton.querySelector('p') : null;

    // 새로운 DOM 요소 선택
    const onText = document.getElementById('on-text');
    const offText = document.getElementById('off-text');


    if (onOffButton && mapRuteLayer && buttonText && onText && offText) {
        
        // 텍스트 색상을 업데이트하는 함수
        function updateTextColors(isON) {
            if (isON) {
                // ON 상태일 때: "ON은 연결" 활성화, "OFF는 안심" 비활성화
                onText.classList.add('text-active-color');
                offText.classList.remove('text-active-color');
            } else {
                // OFF 상태일 때: "OFF는 안심" 활성화, "ON은 연결" 비활성화
                offText.classList.add('text-active-color');
                onText.classList.remove('text-active-color');
            }
        }
        
        // 초기 상태 설정 (OFF 상태로 시작)
        updateTextColors(false);
        
        // 클릭 리스너 수정
        onOffButton.addEventListener('click', function() {
            
            // 1. 배경 이미지 가시성 토글
            mapRuteLayer.classList.toggle('is-rute-visible');

            // 2. 현재 상태 확인 및 관련 요소 업데이트
            const isCurrentlyON = mapRuteLayer.classList.contains('is-rute-visible');

            // 버튼 텍스트 및 깜빡임 토글
            if (isCurrentlyON) {
                buttonText.textContent = 'ON';
                onOffButton.classList.remove('is-pulsing'); 
            } else {
                buttonText.textContent = 'OFF';
                onOffButton.classList.add('is-pulsing'); 
            }
            
            // **3. 텍스트 색상 업데이트 함수 호출**
            updateTextColors(isCurrentlyON);
        });
        
        // 페이지 로드 시 초기 상태 (OFF)로 설정 (깜빡임 시작 및 OFF 텍스트 활성화)
        onOffButton.classList.add('is-pulsing');
        buttonText.textContent = 'OFF';
    }

    // ==========================================================
    // 5. 열네 번째 섹션: Sticky Scroll 이미지 교체 로직 (#section-connection)
    // ==========================================================

    const connectionSection = document.getElementById('section-connection');
    const connectionWrapper = document.getElementById('connection-sticky-wrapper'); 
    const connectionImage = document.getElementById('connection-phone-img');

    if (connectionWrapper && connectionImage && connectionSection) {

        // 1. 이미지 경로 데이터 (3단계)
        const connectionImageGroups = [
            './img/connection/phone1.png', // 0% ~ 33%
            './img/connection/phone2.png', // 33% ~ 66% (실제 파일 경로로 변경 필요)
            './img/connection/phone3.png'  // 66% ~ 100% (실제 파일 경로로 변경 필요)
        ];

        let currentConnectionStep = 0; 
        
        const updateConnectionImage = (step) => {
            if (step !== currentConnectionStep) {
                connectionImage.src = connectionImageGroups[step];
                currentConnectionStep = step;
            }
        };
        
        // 초기 이미지 설정
        updateConnectionImage(0);

        // 2. 스크롤 이벤트 핸들러
        const handleConnectionScroll = () => {
            const rect = connectionWrapper.getBoundingClientRect();
            
            // 스크롤 진행 거리
            const scrollProgress = -rect.top;
            
            // 인터랙션이 진행되는 전체 스크롤 길이
            const interactionHeight = connectionWrapper.offsetHeight - window.innerHeight;
            
            // 스크롤 진행률 (0.0 ~ 1.0)
            const progressRatio = Math.min(1, Math.max(0, scrollProgress / interactionHeight));

            // 총 3단계이므로, 진행률을 3등분하여 단계를 결정합니다.
            let newStep;
            
            if (progressRatio < 0.33) {
                newStep = 0;
            } else if (progressRatio < 0.66) {
                newStep = 1;
            } else {
                newStep = 2;
            }

            // 현재 단계와 다를 경우에만 이미지 업데이트
            if (newStep !== currentConnectionStep) {
                updateConnectionImage(newStep);
            }
        };

        // 스크롤 이벤트 리스너 등록
        window.addEventListener('scroll', handleConnectionScroll);
    }

    // ==========================================================
    // 6. 열두 번째 섹션: 스크롤 시 이미지 변경 로직
    // ==========================================================

    const detectionTarget1 = document.querySelector('.rockImg12'); 
    const rockImage12 = document.getElementById('rock-image-12');

    if (detectionTarget1 && rockImage12) {
        
        const originalSrc = './img/aimasking/rock1.png'; 
        const altSrc = './img/aimasking/rock2.png';      
        
        rockImage12.src = originalSrc; 
        
        // Observer 설정: 요소의 상단이 화면 중앙을 지날 때 감지하도록 수정
        const rockOptions = {
            root: null, 
            // 뷰포트 하단을 50% 위로 끌어올려 화면 중앙에 기준선을 만듭니다.
            rootMargin: '0px 0px -50% 0px', 
            threshold: 0 // 기준선에 닿자마자 감지
        };

        const rockObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.target === detectionTarget1) {
                    
                    if (entry.isIntersecting) {
                        // 요소의 상단이 화면 중앙선에 진입했을 때 이미지 변경
                        rockImage12.src = altSrc; 
                        
                        // 이미지가 한 번만 바뀌도록 관찰 중지
                        observer.unobserve(detectionTarget1); 
                        
                    } 
                }
            });
        };

        const rockObserver = new IntersectionObserver(rockObserverCallback, rockOptions);
        rockObserver.observe(detectionTarget1); 
    }

    // ==========================================================
    // 7. 열두 번째 섹션: Sticky Scroll 이미지/텍스트 교체 로직 (#section-aimasking)
    // ==========================================================

    // 1. 필요한 요소들을 선택합니다.
        const scrollContainer = document.querySelector('.all-box12'); // 스크롤이 발생하는 컨테이너
        const textBoxes = document.querySelectorAll('.box12'); // 각 스크롤 섹션 (텍스트 박스)
        const targetImage = document.querySelector('.img12 img'); // 이미지가 변경될 <img> 태그

        // 2. 변경될 이미지 경로를 순서대로 배열로 만듭니다.
        // .box의 순서와 일치해야 합니다.
        const imagePaths = [
            './img/aimasking/phone1.png', // 첫 번째 .box에 대응
            './img/aimasking/phone2.png', // 두 번째 .box에 대응
            './img/aimasking/phone3.png', // 세 번째 .box에 대응
            './img/aimasking/phone4.png'  // 네 번째 .box에 대응
        ];

        // 3. 텍스트 박스 상단이 화면 중앙에 도달하는 기준선 (기준점)을 계산합니다.
        // 화면 높이(뷰포트 높이)의 절반입니다.
        const viewportCenter = window.innerHeight / 2;

        // 4. 스크롤 이벤트를 감지하여 이미지 변경 함수를 실행합니다.
        scrollContainer.addEventListener('scroll', () => {
            
            // textBoxes를 순회하며 현재 활성화된 박스를 찾습니다.
            textBoxes.forEach((box, index) => {
                
                // getBoundingClientRect()로 현재 뷰포트 대비 요소의 위치를 가져옵니다.
                const boxRect = box.getBoundingClientRect();
                
                // boxRect.top: 요소의 상단 모서리가 뷰포트 상단으로부터 얼마나 떨어져 있는지 (픽셀 단위)
                
                // 텍스트 박스의 상단이 화면 중앙 (viewportCenter)에 도달했는지 확인합니다.
                // **boxRect.top < viewportCenter**: 상단이 중앙을 지나서 위로 올라감
                // **boxRect.bottom > viewportCenter**: 하단이 아직 중앙을 지나지 않아 현재 뷰포트 중앙에 걸쳐 있음
                
                // 즉, 현재 박스가 뷰포트 중앙선을 감싸고 있을 때 (박스의 상단은 중앙을 지났고, 하단은 중앙을 지나지 않았을 때)
                if (boxRect.top < viewportCenter && boxRect.bottom > viewportCenter) {
                    
                    // 해당 인덱스에 맞는 이미지 경로로 변경합니다.
                    if (imagePaths[index]) {
                        targetImage.src = imagePaths[index];
                    }
                }
            });
        });
        
        // 페이지 로드 시 첫 번째 이미지를 강제로 로드합니다. (초기 설정)
        targetImage.src = imagePaths[0];

    })

document.addEventListener("DOMContentLoaded", function() {
    const video1 = document.getElementById('user-video');
    const playButton = document.getElementById('play-button-overlay');
    
    // 오버레이가 아닌 '비디오' 요소 자체에 클릭 이벤트 리스너를 추가합니다.
    video1.addEventListener('click', function() {
        
        // 첫 클릭 시 음소거 해제 (비디오 클릭 시에도 동일하게 적용)
        if (video1.muted) {
            video1.muted = false;
        }

        // 재생/일시정지 상태 토글
        if (video1.paused) {
            // 멈춰있으면 재생
            video1.play()
                .then(() => {
                    // 재생 시작 시 오버레이 숨김을 위해 클래스 추가
                    playButton.classList.add('is-playing');
                });
        } else {
            // 재생 중이면 일시정지
            video1.pause();
            // 일시정지 시 오버레이 표시를 위해 클래스 제거
            playButton.classList.remove('is-playing');
        }
    });

    // 오버레이 클릭 이벤트는 그대로 두어 초기 재생을 시작하게 합니다.
    // (선택 사항: 초기 재생은 비디오 클릭으로 대체 가능)
    playButton.addEventListener('click', function(e) {
        // 오버레이가 클릭되면 video 요소로 클릭 이벤트를 전달합니다.
        // 또는, 위 video.addEventListener의 로직을 직접 실행해도 됩니다.
        video1.click(); 
    });
    
    // 영상 재생이 끝났을 때 자동 정지 및 초기화 (변경 없음)
    video1.addEventListener('ended', function() {
        playButton.classList.remove('is-playing');
        video1.currentTime = 0; 
    });
    
    // 초기 상태 설정
    playButton.textContent = ' ▷\tCLICK'; 
});

document.addEventListener('DOMContentLoaded', function() {
    // 2. HTML에서 'Topbutton' 클래스를 가진 요소를 찾습니다.
    const topButton = document.querySelector('.Topbutton');

    // 3. 버튼이 존재하는지 확인하고 클릭 이벤트를 연결합니다.
    if (topButton) {
        topButton.addEventListener('click', function() {
            // 4. window.scrollTo()를 사용하여 최상단으로 이동합니다.
            window.scrollTo({
                top: 0,         // Y축 위치를 0 (최상단)으로 설정
                left: 0,        // X축 위치를 0으로 설정
                behavior: 'smooth' // 부드러운 스크롤 애니메이션 적용
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
        
        // 감지할 대상 (바 차트 ul)을 선택합니다.
        const barChartElement = document.querySelector('.animate-bar-chart');
        
        // ----------------------------------------------------------
        // Intersection Observer 설정
        // ----------------------------------------------------------
        
        // threshold: 0.5 (요소의 50%가 뷰포트와 교차할 때 트리거)
        // 이는 요소가 대략 화면 중앙에 왔을 때를 의미합니다.
        const observerOptions = { 
            root: null, 
            rootMargin: '0px', 
            threshold: 0.5 // 요소의 절반(50%)이 보일 때
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // isIntersecting: 요소가 threshold 비율만큼 교차하는지 여부
                if (entry.isIntersecting) {
                    // 1. 교차하면 .active 클래스를 부여하여 애니메이션 시작
                    entry.target.classList.add('active'); 
                    
                    // 2. 한 번 실행 후에는 관찰을 중지하여 불필요한 재실행 방지
                    observer.unobserve(entry.target); 
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // 바 차트 요소를 관찰 시작
        if (barChartElement) {
            observer.observe(barChartElement);
        }
    });