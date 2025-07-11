from manim import *

class DetourThroughInfinity(Scene):
    def construct(self):
        title = Text("A Detour Through Infinity", font_size=48)
        subtitle = Text("The Well-Ordering Principle", font_size=36)

        title.move_to(UP * 1)
        subtitle.next_to(title, DOWN)

        self.play(Write(title), run_time=2)
        self.play(Write(subtitle), run_time=2)
        
        self.wait(0.5)