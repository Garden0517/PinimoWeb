// interaction.js 파일 통합 및 수정

document.addEventListener("DOMContentLoaded", function() {

    // ==========================================================
    // 1. 섹션 등장 효과 로직 (.animate-item)
    // ==========================================================
    const animateItems = document.querySelectorAll('.animate-item');
    // NOTE: observerOptions는 4개의 다른 로직에서 사용되므로, 중복 선언 방지를 위해 최상위에서 선언합니다.
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
    const animateItems2 = document.querySelectorAll('.animate-item-2'); 
    
    const observerCallback2 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible-2'); 
                observer.unobserve(entry.target); 
            }
        });
    };
    const observer2 = new IntersectionObserver(observerCallback2, observerOptions);
    animateItems2.forEach(item => {
        observer2.observe(item);
    });

    const animateItems3 = document.querySelectorAll('.animate-item-3'); 
    
    const observerCallback3 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible-3'); 
                observer.unobserve(entry.target); 
            }
        });
    };
    const observer3 = new IntersectionObserver(observerCallback3, observerOptions);
    animateItems3.forEach(item => {
        observer3.observe(item);
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
        // **fadeOptions는 observerOptions을 재사용**
        const fadeObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.target === detectionTarget && entry.isIntersecting) { 
                    newFadeImage.classList.add('is-faded-in');
                    observer.unobserve(detectionTarget); 
                }
            });
        };

        const fadeObserver = new IntersectionObserver(fadeObserverCallback, observerOptions); // observerOptions 사용
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
                onText.classList.add('text-active-color');
                offText.classList.remove('text-active-color');
            } else {
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
            
            // 3. 텍스트 색상 업데이트 함수 호출
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

// 새로 추가된 텍스트 요소
const connectionTextContainer = document.getElementById('connection-text-container');
const connectionTitle = document.getElementById('connection-title');
const connectionDesc = document.getElementById('connection-desc');


if (connectionWrapper && connectionImage && connectionSection && connectionTextContainer && connectionTitle && connectionDesc) {

    // 1. 이미지 경로 데이터 (3단계)
    const connectionImageGroups = [
        './img/connection/phone1.png', // 0% ~ 33%
        './img/connection/phone2.png', // 33% ~ 66% 
        './img/connection/phone3.png'  // 66% ~ 100% 
    ];

    // 2. 텍스트 박스 내용 데이터 (3단계)
    const connectionTextGroups = [
        {
            title: '공개는 자유롭게</br>노출은 안전하게',
            desc: '직접 친구 그룹별로 자세한 공개범위를 설정해 타인과 감정의</br>공유 여부와 범위를 자유롭게 직접 조절해보세요!',
        },
        {
            title: '모두 다른 친구들</br>각각 다른 게시물',
            desc: '친구 목록의 각기 다른 성격과 유형을 가진 친구들</br>모두에게 각각의 어울리는 게시물을 생성할 수 있어요!',
        },
        {
            title: '쉽고 빠른 게시글</br>변경과 태그 생성',
            desc: '게시글과 태그를 쉽고 빠르게 생성하고 변경하여</br>내가 보여주고 싶은 삶의 범위만 공유할 수 있어요!',
        }
    ];

    let currentConnectionStep = 0; 
    const FADE_DURATION = 500; // 페이드 전환 시간 (0.5초)

    const updateConnectionContent = (step) => {
        if (step !== currentConnectionStep) {
            
            // 1. 페이드 아웃 시작 (투명도 0으로)
            connectionTextContainer.classList.add('fade-out');

            setTimeout(() => {
                // 2. 내용과 이미지 업데이트 (투명도가 0일 때)
                
                // 이미지 업데이트 (기존 로직)
                connectionImage.src = connectionImageGroups[step]; 
                
                // 텍스트 업데이트
                connectionTitle.innerHTML = connectionTextGroups[step].title;
                connectionDesc.innerHTML = connectionTextGroups[step].desc;

                // 3. 페이드 인 시작 (투명도 1로 복귀)
                connectionTextContainer.classList.remove('fade-out');

                currentConnectionStep = step;
            }, FADE_DURATION * 0.5); // 전환 시간의 절반 후에 내용 변경
        }
    };
    
    // 초기 내용 및 이미지 설정
    updateConnectionContent(0);

    // 3. 스크롤 이벤트 핸들러
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

        // 현재 단계와 다를 경우에만 이미지 및 텍스트 업데이트
        if (newStep !== currentConnectionStep) {
            updateConnectionContent(newStep);
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

    const allBox = document.querySelector('.all-box12');
    const textBoxes = document.querySelectorAll('.box12');
    const targetImage = document.querySelector('.img12 img');
    const interactionSection = document.querySelector('.scroll-interaction-section');
    
    const imagePaths = [
        './img/aimasking/phone1.png',
        './img/aimasking/phone2.png',
        './img/aimasking/phone3.png',
        './img/aimasking/phone4.png'
    ];
    
    // 텍스트 박스 총 개수
    const totalBoxCount = textBoxes.length;
    
    // 윈도우 크기는 스크롤 시 변하지 않으므로 전역으로 정의
    const screenHeight = window.innerHeight; 
    
    // 텍스트 이동이 필요한 총 거리 (마지막 박스까지 스크롤될 거리)
    // (총 박스 수 - 1) * 100vh
    const maxMovement = (totalBoxCount - 1) * screenHeight; 
    
    let currentImageIndex = -1; // 현재 표시 중인 이미지 인덱스
    
    // 💡 이미지 전환 기준점: 화면 높이의 20% 지점 (하단에서 위로 80% 올라왔을 때)
    const imageChangeThreshold = screenHeight * 0.2; 
    
    let isScrolling; // 스크롤 중인지 확인하는 플래그
    
    // 스크롤 핸들러 (기존과 동일)
    function handleScroll() {
        const sectionRect = interactionSection.getBoundingClientRect(); 
        
        // 1. 섹션이 화면 상단에 닿아 고정되었을 때
        if (sectionRect.top <= 0 && sectionRect.bottom > screenHeight) {
            
            // 섹션이 화면 상단에 고정된 이후 스크롤된 거리 
            let scrollProgress = Math.abs(sectionRect.top);
            
            // 스크롤 진행도를 최대 이동 거리로 제한
            if (scrollProgress > maxMovement) {
                scrollProgress = maxMovement;
            }

            // 텍스트 박스 이동
            allBox.style.transform = `translateY(-${scrollProgress}px)`;
            
            // ----------------------------------------------------
            // 💡 이미지 전환 로직 (애니메이션 적용)
            // ----------------------------------------------------
            
            const newIndex = Math.min(
                totalBoxCount - 1, 
                Math.floor((scrollProgress + imageChangeThreshold) / screenHeight)
            );
            
            // 이미지가 변경되어야 할 때만 업데이트
            if (newIndex !== currentImageIndex) {
                
                // 1. opacity를 0.2로 설정하여 현재 이미지를 0.3초 동안 흐리게 함 (Fade Out)
                targetImage.style.opacity = 0.2;

                // 2. 0.3초 후 (CSS transition 시간) 새로운 이미지를 로드하고 다시 opacity를 1로 설정 (Fade In)
                setTimeout(() => {
                    targetImage.src = imagePaths[newIndex];
                    targetImage.style.opacity = 1;
                    currentImageIndex = newIndex;
                }, 300); // 300ms는 CSS transition 시간과 일치해야 함
            }
        } 
    }

    // ----------------------------------------------------
    // 💡 스냅 효과를 위한 스크롤 종료 감지 및 위치 조정 함수
    // ----------------------------------------------------
    function snapScroll() {
        // 스크롤이 끝난 후 150ms가 지나면 실행
        isScrolling = setTimeout(() => {
            const sectionRect = interactionSection.getBoundingClientRect(); 
            
            // 섹션이 고정되어 있는 상태일 때만 스냅 작동
            if (sectionRect.top <= 0 && sectionRect.bottom > screenHeight) {
                let scrollProgress = Math.abs(sectionRect.top);
                
                // 현재 스크롤 위치가 몇 번째 박스에 가장 가까운지 계산
                // 예: 1.2 -> 1, 1.8 -> 2
                const closestBoxIndex = Math.round(scrollProgress / screenHeight);
                
                // 스냅되어야 할 정확한 위치 (스크롤 상단 기준)
                const snapToPosition = closestBoxIndex * screenHeight;
                
                // 실제 스크롤해야 할 윈도우 상단 위치 
                // snapToPosition은 섹션 내에서 스크롤된 거리이므로, 
                // 섹션이 시작하는 지점(섹션의 window.offsetTop)에 snapToPosition을 더해야 함
                const targetScrollY = interactionSection.offsetTop + snapToPosition;

                // 윈도우 스크롤을 목표 위치로 부드럽게 이동
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
            }
        }, 150); // 스크롤 이벤트가 멈춘 후 약간의 딜레이
    }
    
    // 윈도우 스크롤 이벤트에 핸들러 등록
    window.addEventListener('scroll', () => {
        // 스크롤 중에는 스냅 타이머를 초기화
        clearTimeout(isScrolling);
        
        // 텍스트 및 이미지 업데이트 실행
        handleScroll();

        // 스크롤이 멈췄을 때 스냅이 실행되도록 타이머 설정
        snapScroll();
    });

    // 페이지 로드 시 첫 번째 이미지를 로드하고 초기 상태 설정
    targetImage.src = imagePaths[0];
    currentImageIndex = 0;


    // ==========================================================
    // 8. 추가 로직: 비디오 재생, Topbutton, 차트 애니메이션, 컬러 블록 애니메이션, 아이콘/비디오 루프
    // (이하 모든 로직은 이미 최상위 DOMContentLoaded 안에 통합되어 있음)
    // ==========================================================

    const video1 = document.getElementById('user-video');
    const playButton = document.getElementById('play-button-overlay');
    
    if (video1 && playButton) {
        video1.addEventListener('click', function() {
            if (video1.muted) {
                video1.muted = false;
            }
            if (video1.paused) {
                video1.play()
                    .then(() => {
                        playButton.classList.add('is-playing');
                    });
            } else {
                video1.pause();
                playButton.classList.remove('is-playing');
            }
        });
        playButton.addEventListener('click', function(e) {
            video1.click(); 
        });
        video1.addEventListener('ended', function() {
            playButton.classList.remove('is-playing');
            video1.currentTime = 0; 
        });
        playButton.textContent = ' ▷\tCLICK'; 
    }

    const topButton = document.querySelector('.Topbutton');
    if (topButton) {
        topButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        });
    }

    const animatedCharts = document.querySelectorAll('.animate-bar-chart, .animated-chart');
    const chartObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (target.classList.contains('animate-bar-chart')) {
                    target.classList.add('active');
                } 
                if (target.classList.contains('animated-chart')) {
                    target.classList.add('animate');
                }
                observer.unobserve(target); 
            }
        });
    };
    const chartObserver = new IntersectionObserver(chartObserverCallback, observerOptions); // observerOptions 사용
    animatedCharts.forEach(element => {
        if (element.classList.contains('pie-chart-mask')) {
             element.style.setProperty('--percentage', '0%'); 
        }
        chartObserver.observe(element);
    });

    const container = document.querySelector('.color-container');
    const colorBlocks = document.querySelectorAll('.color-block:not(.block-1)');
    const orderedBlocks = Array.from(colorBlocks)
        .sort((a, b) => {
            const orderA = parseInt(a.getAttribute('data-order'));
            const orderB = parseInt(b.getAttribute('data-order'));
            const customOrder = {2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8};
            return customOrder[orderA] - customOrder[orderB];
        });

    const colorObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const totalBlocks = orderedBlocks.length;
                orderedBlocks.forEach((block, index) => {
                    block.style.zIndex = (totalBlocks - 1) - index; 
                });
                orderedBlocks.forEach((block, index) => {
                    const delay = index * 200;
                    setTimeout(() => {
                        block.classList.add('is-visible');
                    }, delay);
                });
                observer.unobserve(entry.target);
            }
        });
    };
    const colorObserver = new IntersectionObserver(colorObserverCallback, observerOptions); // observerOptions 사용
    if (container) {
        colorObserver.observe(container); 
    }


    const iconItems = document.querySelectorAll('.icon-item');
    const totalIconItems = iconItems.length;
    let currentIconIndex = 0;

    function nextIcon() {
        if (iconItems.length === 0) return;
        iconItems[currentIconIndex].classList.remove('active');
        currentIconIndex = (currentIconIndex + 1) % totalIconItems;
        iconItems[currentIconIndex].classList.add('active');
    }

    if (iconItems.length > 0) {
        setInterval(nextIcon, 1500); 
        if (!iconItems[0].classList.contains('active')) {
            iconItems[0].classList.add('active');
        }
    }


    const videos = document.querySelectorAll('.loopVideo');
    if (videos.length > 0) { 
        videos.forEach(video => {
            video.addEventListener('timeupdate', () => {
                const buffer = 0.3;
                if (video.currentTime >= video.duration - buffer) {
                    video.currentTime = 0;
                    video.play();
                }
            });
            video.addEventListener('loadeddata', () => {
                video.play();
            });
            video.play(); 
        });
    }

}); // <-- 최상위 DOMContentLoaded 끝

document.addEventListener('DOMContentLoaded', () => {
    // 1. 각 <img> 태그에 대응하는 5개의 독립된 이미지 경로 배열을 정의합니다.
    // 각 배열은 5개의 이미지 경로를 가지고 순환됩니다.
    
    // **예시 이미지 경로 배열:** (실제 파일 경로로 변경하세요)
    const imageSets = [
        // Set 1: img-1에 들어갈 이미지 목록 (5개)
        [
            './img/authenticity/phone1.png',
            './img/authenticity/phone2.png',
            './img/authenticity/phone3.png',
            './img/authenticity/phone4.png',
            './img/authenticity/phone5.png',
        ],
        // Set 2: img-2에 들어갈 이미지 목록 (5개)
        [
            './img/authenticity/phone2.png',
            './img/authenticity/phone3.png',
            './img/authenticity/phone4.png',
            './img/authenticity/phone5.png',
            './img/authenticity/phone1.png',
        ],
        // Set 3: img-3에 들어갈 이미지 목록 (5개)
        [
            './img/authenticity/phone3.png',
            './img/authenticity/phone4.png',
            './img/authenticity/phone5.png',
            './img/authenticity/phone1.png',
            './img/authenticity/phone2.png',
        ],
        // Set 4: img-4에 들어갈 이미지 목록 (5개)
        [
            './img/authenticity/phone4.png',
            './img/authenticity/phone5.png',
            './img/authenticity/phone1.png',
            './img/authenticity/phone2.png',
            './img/authenticity/phone3.png',
        ],
        // Set 5: img-5에 들어갈 이미지 목록 (5개)
        [
            './img/authenticity/phone5.png',
            './img/authenticity/phone1.png',
            './img/authenticity/phone2.png',
            './img/authenticity/phone3.png',
            './img/authenticity/phone4.png',
        ]
    ];

    // 2. 이미지를 변경할 요소들 선택 (id를 사용합니다.)
    const imageElements = [
        document.getElementById('img-16-1'),
        document.getElementById('img-16-2'),
        document.getElementById('img-16-3'),
        document.getElementById('img-16-4'),
        document.getElementById('img-16-5')
    ];
    
    // 3. 변수 설정
    let currentIndex = 0; // 현재 표시 중인 imageSets 내부 인덱스
    const totalImagesInSet = imageSets[0].length; // 각 세트의 이미지 개수 (5개)
    const intervalTime = 1500; // 2초 간격 (3000ms)

    // 4. 모든 이미지를 다음 배열 순서로 교체하는 함수
    function changeDifferentImages() {
        // 다음 인덱스 계산 (0 -> 1 -> 2 -> 3 -> 4 -> 0 순환)
        currentIndex = (currentIndex + 1) % totalImagesInSet; 
        
        // **핵심 로직:**
        // imageElements 배열을 순회합니다. (index는 0부터 4)
        imageElements.forEach((imgElement, setIndex) => {
            // imgElement (예: img-1, img-2 등)
            // setIndex (0, 1, 2, 3, 4) -> imageSets 배열의 인덱스
            
            // 각 <img> 태그는 해당하는 imageSets[setIndex] 배열에서
            // 현재 순환 인덱스(currentIndex)에 맞는 경로를 가져와 적용합니다.
            const nextImagePath = imageSets[setIndex][currentIndex];
            imgElement.src = nextImagePath;
        });
    }

    // 5. 일정 시간 간격으로 changeDifferentImages 함수 실행
    setInterval(changeDifferentImages, intervalTime);
});