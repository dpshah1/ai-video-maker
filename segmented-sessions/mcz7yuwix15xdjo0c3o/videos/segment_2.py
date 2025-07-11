from manim import *

class BridgesOfKonigsberg(Scene):
    def construct(self):
        title = Text("The Bridges of Königsberg", font_size=36)
        subtitle = Text("The Birth of Graph Theory", font_size=24)
        bridge_image = Circle(radius=0.5).scale(0.5)
        
        title.move_to(UP * 2)
        subtitle.next_to(title, DOWN)
        bridge_image.next_to(subtitle, DOWN, buff=0.5)

        self.play(Write(title), run_time=1.5)
        self.play(Write(subtitle), run_time=1.5)
        self.play(FadeIn(bridge_image), run_time=1.5)
        
        self.wait(0.3)  # Adjust to ensure total duration is 4.8 seconds